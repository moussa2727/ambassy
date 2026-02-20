// components/shared/Footer.tsx
'use client';

import Link from 'next/link';
import {
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  InstagramLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Passeports & Visas', href: '#' },
      { label: 'État civil', href: '#' },
      { label: 'Assistance consulaire', href: '#' },
      { label: 'Légalisation', href: '#' },
    ],
    informations: [
      { label: 'À propos', href: '#' },
      { label: "L'Ambassadeur", href: '#' },
      { label: 'Notre équipe', href: '#' },
      { label: 'Partenaires', href: '#' },
    ],
    pratique: [
      { label: "Horaires d'ouverture", href: '#' },
      { label: 'Prendre rendez-vous', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: "Plan d'accès", href: '#' },
    ],
  };

  const socialLinks: SocialLink[] = [
    {
      icon: <FacebookLogo size={20} />,
      href: '#',
      label: 'Facebook',
    },
    {
      icon: <TwitterLogo size={20} />,
      href: '#',
      label: 'Twitter',
    },
    {
      icon: <LinkedinLogo size={20} />,
      href: '#',
      label: 'LinkedIn',
    },
    {
      icon: <InstagramLogo size={20} />,
      href: '#',
      label: 'Instagram',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer */}
      <div className="container py-16">
        <div className="flex flex-wrap justify-between gap-10 lg:gap-12">
          {/* Brand */}
          <div className="w-full lg:w-[40%] xl:w-[35%]">
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/"
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <img
                  src="/favicon.png"
                  alt="Logo Ambassade"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </Link>
              <div>
                <h3 className="text-lg font-display font-semibold leading-tight">
                  Ambassade
                </h3>
                <p className="text-sm text-white/70">de la République</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 max-w-sm">
              Au service de nos citoyens à l'étranger, nous œuvrons chaque jour
              pour renforcer les liens diplomatiques et accompagner nos
              ressortissants.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="flex-1 min-w-50">
            <h4 className="font-display font-semibold text-lg mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-50">
            <h4 className="font-display font-semibold text-lg mb-4">
              Informations
            </h4>
            <ul className="space-y-3">
              {footerLinks.informations.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pratique */}
          <div className="flex-1 min-w-50">
            <h4 className="font-display font-semibold text-lg mb-4">
              Pratique
            </h4>
            <ul className="space-y-3">
              {footerLinks.pratique.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-gray-800">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>
            © {currentYear} Ambassade de la République. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Politique de confidentialité
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Accessibilité
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
