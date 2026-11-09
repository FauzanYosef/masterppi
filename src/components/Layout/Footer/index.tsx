"use client";

import { FooterLinkType } from "@/app/(main)/types/footerlinks";
import {
  DEFAULT_NAVIGATION,
  getContactInfo,
  getNavigation,
  getSocialLinks,
  toFooterLinks,
  type ContactInfo,
  type SocialLink,
} from "@/lib/site-content";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../Header/Logo";

const SOCIAL_ICONS: Record<string, string> = {
  instagram: "tabler:brand-instagram",
  facebook: "tabler:brand-facebook",
  youtube: "tabler:brand-youtube-filled",
  tiktok: "tabler:brand-tiktok",
  linkedin: "tabler:brand-linkedin",
  twitter: "tabler:brand-twitter-filled",
  x: "tabler:brand-x",
  whatsapp: "tabler:brand-whatsapp",
};

const whatsappHref = (value: string) => `https://wa.me/${value.replace(/\D/g, "").replace(/^0/, "62")}`;
const phoneHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

const ContactRow = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-sec-yellow">
      <Icon icon={icon} width={18} height={18} />
    </span>
    <div className="text-sm leading-relaxed text-white/70">{children}</div>
  </li>
);

const Footer = () => {
  const [footerlink, setFooterlink] = useState<FooterLinkType[]>(toFooterLinks(DEFAULT_NAVIGATION));
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [social, setSocial] = useState<SocialLink[]>([]);

  // Menu, kontak, dan media sosial dari CMS (fisip-api).
  useEffect(() => {
    let active = true;
    Promise.all([getNavigation(), getContactInfo(), getSocialLinks()]).then(([items, info, links]) => {
      if (!active) return;
      setFooterlink(toFooterLinks(items));
      setContact(info);
      setSocial(links);
    });
    return () => {
      active = false;
    };
  }, []);

  const linkClass = "text-sm text-white/60 transition hover:text-white";

  return (
    <footer className="relative overflow-hidden bg-darkblue text-white dark:bg-darklight">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

      <div className="container relative pt-20 pb-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Identitas & media sosial */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Logo inverted />
            <p className="max-w-sm text-sm text-white/60">
              Program Magister Pemikiran Politik Islam, Fakultas Ilmu Sosial dan Ilmu Politik, UIN Sunan Gunung
              Djati Bandung.
            </p>
            {social.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {social.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-sec-yellow hover:bg-sec-yellow hover:text-darkblue"
                  >
                    <Icon icon={SOCIAL_ICONS[link.platform] ?? "tabler:link"} width={20} height={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Menu */}
          {footerlink.map((section) => (
            <div key={section.section} className="lg:col-span-2">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] !text-white">{section.section}</p>
              <ul className="flex flex-col gap-3">
                {section.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kontak */}
          <div className="lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] !text-white">Kontak</p>
            <ul className="flex flex-col gap-4">
              {contact?.address && (
                <ContactRow icon="tabler:map-pin">
                  {contact.mapUrl ? (
                    <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                      {contact.address}
                    </a>
                  ) : (
                    contact.address
                  )}
                </ContactRow>
              )}
              {(contact?.phone || contact?.whatsapp) && (
                <ContactRow icon="tabler:phone">
                  <a
                    href={contact.phone ? phoneHref(contact.phone) : whatsappHref(contact.whatsapp ?? "")}
                    className="transition hover:text-white"
                  >
                    {contact.phone ?? contact.whatsapp}
                  </a>
                </ContactRow>
              )}
              {contact?.email && (
                <ContactRow icon="tabler:mail">
                  <a href={`mailto:${contact.email}`} className="break-all transition hover:text-white">
                    {contact.email}
                  </a>
                </ContactRow>
              )}
              {!contact && (
                <li>
                  <Link href="/profil/kontak" className={linkClass}>
                    Lihat halaman kontak →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-center md:flex-row md:text-left">
          <p className="text-xs !text-white/50">
            © {new Date().getFullYear()} Program Magister Pemikiran Politik Islam — FISIP UIN Sunan Gunung Djati Bandung
          </p>
          <p className="text-xs !text-white/40">uinsgd.ac.id</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
