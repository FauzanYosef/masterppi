#!/usr/bin/env bash
# Rilis versi baru ke production.
#
#   scripts/release.sh patch|minor|major [--migrate] [--dry-run]
#   scripts/release.sh deploy             # deploy ulang versi saat ini (tanpa naik versi)
#   scripts/release.sh rollback <versi>   # kembali ke image bertag versi itu (tanpa build)
#   scripts/release.sh status             # versi di GitHub, laptop, dan server
#
# Alur rilis: cek repo bersih & sinkron → cek kode → naik versi (package.json + tag git vX.Y.Z)
# → push → GitHub Release → build image <repo>:X.Y.Z di server → jalankan → cek versi yang hidup.
# Server dijangkau lewat LAN (192.168.18.134) atau IP publik (103.55.33.134), mana yang tersedia.
set -euo pipefail

# ---------------------------- konfigurasi project ----------------------------
NAME="Magister PPI"                        # nama project (untuk pesan)
IMAGE="mppi-web"                      # repo image Docker, mis. fisip-admin
ALT_TAG="latest"                  # tag bergerak yang tetap diperbarui (latest/production)
REMOTE_DIR="/www/wwwroot/magisterppi.uinsgd.ac.id"            # folder project di server
COMPOSE_FILES="-f docker-compose.prod.yml"      # mis. "-f docker-compose.prod.yml"
SERVICE="web"                  # nama service compose
VERIFY_URL="http://127.0.0.1:3012/api/version"            # URL (diakses dari dalam server) yang mengembalikan {"version": ...}
CHECK_CMD="npm run typecheck"              # pemeriksaan sebelum rilis
MIGRATE_CMD=""          # perintah migrasi (kosong = tidak ada)
# ------------------------------------------------------------------------------

SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/fisip_server}"
SSH_OPTS=(-i "$SSH_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=6)
# Server dicoba lewat LAN dulu (cepat), lalu IP publik bila laptop di luar jaringan kampus.
# Bisa dipaksa dengan DEPLOY_SSH_HOST=user@host.
resolve_host() {
  local h
  for h in ${DEPLOY_SSH_HOST:-} root@192.168.18.134 root@103.55.33.134; do
    if ssh "${SSH_OPTS[@]}" "$h" true 2>/dev/null; then SSH_HOST="$h"; return 0; fi
  done
  return 1
}
SSH_HOST=""; resolve_host || true
ssh_run() { ssh "${SSH_OPTS[@]}" "$SSH_HOST" "$@"; }

cd "$(dirname "$0")/.."
say() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
die() { printf '\033[31mGAGAL: %s\033[0m\n' "$*" >&2; exit 1; }
current_version() { node -p "require('./package.json').version"; }

need_server() { [ -n "$SSH_HOST" ] || die "server tidak terjangkau lewat LAN (192.168.18.134) maupun IP publik (103.55.33.134)."; }

wait_for_version() { # $1 = versi yang diharapkan
  local want="$1" out="" i
  for i in $(seq 1 30); do
    out=$(ssh_run "curl -fsS -m 5 '$VERIFY_URL'" 2>/dev/null || true)
    if printf '%s' "$out" | grep -q "\"version\":\"$want\""; then
      echo "OK: server menjalankan $NAME v$want"; return 0
    fi
    sleep 4
  done
  echo "Respons terakhir: ${out:-<kosong>}" >&2
  die "versi $want tidak terdeteksi di server setelah 2 menit. Cek: docker compose logs $SERVICE"
}

remote_deploy() { # $1 = versi, $2 = "build" | "reuse", $3 = "migrate" (opsional)
  local v="$1" mode="$2" migrate="${3:-}"
  ssh_run "set -e; cd '$REMOTE_DIR'
    git fetch -q --tags origin && git checkout -q main && git pull -q --ff-only
    export APP_VERSION='$v'
    if [ '$mode' = build ]; then
      docker compose $COMPOSE_FILES build $SERVICE
      if [ -n '$migrate' ]; then docker compose $COMPOSE_FILES run --rm --no-deps $SERVICE $MIGRATE_CMD; fi
    else
      docker image inspect '$IMAGE:$v' >/dev/null 2>&1 || { echo 'image $IMAGE:$v tidak ada di server'; exit 3; }
    fi
    docker compose $COMPOSE_FILES up -d --no-build $SERVICE
    docker tag '$IMAGE:$v' '$IMAGE:$ALT_TAG'
    docker image prune -f >/dev/null"
}

cmd="${1:-}"
case "$cmd" in
  patch|minor|major)
    shift; MIGRATE=""; DRY=0
    for a in "$@"; do case "$a" in --migrate) MIGRATE=migrate;; --dry-run) DRY=1;; *) die "opsi tidak dikenal: $a";; esac; done
    [ "$MIGRATE" = migrate ] && [ -z "$MIGRATE_CMD" ] && die "project ini tidak punya migrasi"

    say "Pemeriksaan awal"
    [ "$(git branch --show-current)" = main ] || die "harus di branch main"
    [ -z "$(git status --porcelain --untracked-files=no -- . ':!.claude')" ] || die "ada perubahan yang belum di-commit"
    git fetch -q origin --tags
    [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || die "main tidak sama dengan origin/main (push atau pull dulu)"
    command -v gh >/dev/null && gh auth status >/dev/null 2>&1 || die "gh belum login (gh auth login)"
    need_server
    OLD="$(current_version)"
    echo "Versi sekarang: $OLD"

    say "Cek kode: $CHECK_CMD"
    bash -c "$CHECK_CMD"

    if [ "$DRY" = 1 ]; then echo "(dry-run) berhenti sebelum menaikkan versi."; exit 0; fi

    say "Naik versi ($cmd)"
    # --no-git-tag-version: commit & tag dibuat di bawah, agar berkas lokal (mis. .claude/) tidak menghalangi.
    npm version "$cmd" --no-git-tag-version >/dev/null
    NEW="$(current_version)"; TAG="v$NEW"
    git add package.json package-lock.json
    git commit -q -m "Release $TAG"
    git tag -a "$TAG" -m "Release $TAG"
    echo "$OLD → $NEW (tag $TAG)"

    say "Push ke GitHub"
    git push origin main --follow-tags
    gh release create "$TAG" --title "$NAME $TAG" --generate-notes >/dev/null && echo "GitHub Release $TAG dibuat"

    say "Deploy ke server"
    remote_deploy "$NEW" build "$MIGRATE"
    wait_for_version "$NEW"
    say "Selesai: $NAME $TAG live"
    echo "Catatan: bila ada cache CDN yang menyimpan halaman lama, purge cache-nya."
    ;;

  deploy)
    need_server; V="$(current_version)"
    say "Deploy ulang $NAME v$V"
    remote_deploy "$V" build; wait_for_version "$V" ;;

  rollback)
    V="${2:-}"; [ -n "$V" ] || die "pakai: scripts/release.sh rollback <versi>  (mis. 1.0.0)"
    V="${V#v}"; need_server
    say "Rollback $NAME ke v$V (memakai image yang sudah ada)"
    remote_deploy "$V" reuse; wait_for_version "$V"
    echo "Catatan: kode di server tetap di commit terbaru; hanya image/container yang kembali ke v$V." ;;

  status)
    echo "Laptop   : v$(current_version)  ($(git rev-parse --short HEAD))"
    echo "GitHub   : $(git ls-remote --tags origin 'v*' | sed 's#.*refs/tags/##' | sort -V | tail -1 || true)"
    if [ -n "$SSH_HOST" ]; then
      echo "Server   : ($SSH_HOST) $(ssh_run "curl -fsS -m 5 '$VERIFY_URL'" 2>/dev/null || echo 'tidak merespons')"
      echo "Image    : $(ssh_run "docker images '$IMAGE' --format '{{.Tag}}' | sort -V | tr '\n' ' '")"
    else echo "Server   : tidak terjangkau"; fi ;;

  *) sed -n 2,9p "$0"; exit 1 ;;
esac
