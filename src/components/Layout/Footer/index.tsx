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

  return (
    <footer>
      <div className="container py-14">
        <div className="mb-20">
          <div className="w-fit">
            <Logo />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 xl:gap-8">
          {/* KOLOM 1: MEDIA SOSIAL */}
          <div className="lg:col-span-4 sm:col-span-2 flex flex-col gap-5">
            {social.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {social.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                  >
                    <Icon
                      icon={SOCIAL_ICONS[link.platform] ?? "tabler:link"}
                      width={45}
                      height={45}
                      className="text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2 hover:text-primary dark:hover:text-primary duration-300"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* KOLOM 2: LINK MENU */}
          <div className="lg:col-span-4 col-span-1">
            <div className="flex gap-20">
              {footerlink.map((product, i) => (
                <div key={i} className="group relative col-span-2">
                  <p className="text-xl font-semibold mb-9">{product.section}</p>
                  <ul>
                    {product.links.map((item, i) => (
                      <li key={i} className="mb-3">
                        <Link
                          href={item.href}
                          className="text-darkblue/60 dark:text-white/60 hover:text-primary dark:hover:text-primary text-base font-normal mb-6"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {/* KOLOM 3: KONTAK */}
          <div className="lg:col-span-4 col-span-1 flex flex-col gap-8">
            {contact?.address && (
              <div className="flex gap-2">
                <Icon icon="tabler:map-pin" width={22} height={22} className="shrink-0 text-lightgrey" />
                {contact.mapUrl ? (
                  <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="text-base font-normal text-offwhite hover:text-primary">
                    {contact.address}
                  </a>
                ) : (
                  <p className="text-base font-normal text-offwhite">{contact.address}</p>
                )}
              </div>
            )}
            {(contact?.phone || contact?.whatsapp) && (
              <div className="flex gap-2">
                <Icon icon="tabler:phone" width={22} height={22} className="shrink-0 text-lightgrey" />
                <a
                  href={contact.phone ? phoneHref(contact.phone) : whatsappHref(contact.whatsapp ?? "")}
                  className="text-base font-normal text-offwhite hover:text-primary dark:hover:text-primary"
                >
                  {contact.phone ?? contact.whatsapp}
                </a>
              </div>
            )}
            {contact?.email && (
              <div className="flex gap-2">
                <Icon icon="tabler:mail" width={22} height={22} className="shrink-0 text-lightgrey" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-base font-normal text-offwhite hover:text-primary dark:hover:text-primary"
                >
                  {contact.email}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="py-3">
        <p className="text-center">
          © {new Date().getFullYear()} Program Magister Pemikiran Politik Islam — FISIP UIN Sunan Gunung Djati Bandung
        </p>
      </div>
    </footer>
  );
};

export default Footer;
