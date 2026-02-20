'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaEnvelope,
  FaGlobe,
  FaHome,
  FaTools,
  FaInfoCircle,
  FaComment,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import React from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Accueil',
    icon: (
      <FaHome className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
    ),
  },
  {
    to: '/services',
    label: 'Services',
    icon: (
      <FaTools className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
    ),
  },
  {
    to: '/a-propos',
    label: 'À propos',
    icon: (
      <FaInfoCircle className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
    ),
  },
  {
    to: '/contact',
    label: 'Contact',
    icon: (
      <FaComment className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
    ),
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleScroll = useCallback((): void => {
    // Utiliser requestAnimationFrame pour éviter les reflows synchrones
    requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 20);
    });
  }, []);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent): void => {
      if (
        !isMobileMenuOpen ||
        !mobileMenuRef.current ||
        !menuButtonRef.current
      ) {
        return;
      }

      const target = event.target as Node;
      if (
        !mobileMenuRef.current.contains(target) &&
        !menuButtonRef.current.contains(target)
      ) {
        closeMobileMenu();
      }
    },
    [isMobileMenuOpen, closeMobileMenu]
  );

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    },
    [isMobileMenuOpen, closeMobileMenu]
  );

  useEffect(() => {
    const scrollOptions = { passive: true } as const;
    window.addEventListener('scroll', handleScroll, scrollOptions);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Exécuter handleScroll de manière asynchrone
    requestAnimationFrame(handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleScroll, handleClickOutside, handleEscapeKey]);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        pathname === '/'
          ? isScrolled
            ? 'bg-white shadow-md'
            : 'bg-transparent'
          : 'bg-white shadow-md'
      }`}
    >
      {/* Top Bar avec transition améliorée */}
      <div
        className={`text-white text-sm transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'max-h-0 opacity-0 overflow-hidden -translate-y-4'
            : 'max-h-40 opacity-100 bg-green-700 translate-y-0'
        }`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <a
                href="tel:+212537775836"
                className="flex items-center gap-1.5 hover:text-green-200 transition-colors duration-200"
                aria-label="Téléphone"
              >
                <FiPhone className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                <span className="hidden sm:inline">+212 5 37 77 58 36</span>
              </a>
              <a
                href="mailto:ambassade.mali.rabat@diplomatie.ml"
                className="flex items-center gap-1.5 hover:text-green-200 transition-colors duration-200"
                aria-label="Email"
              >
                <FaEnvelope className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                <span className="hidden md:inline">
                  ambassade.mali.rabat@diplomatie.ml
                </span>
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <FaGlobe className="w-4 h-4" />
              <span>Français</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="relative py-3 px-4 sm:px-6 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo avec animation au scroll */}
          <Link
            href="/"
            className="flex items-center space-x-3 group flex-1 min-w-0"
            aria-label="Accueil - Ambassade du Mali au Maroc"
            onClick={closeMobileMenu}
          >
            <div className="relative border-5 rounded-full border-green-500">
              <img
                src="/favicon.png"
                alt="Logo de l'Ambassade du Mali"
                className={`w-12 h-12 rounded-md transition-all duration-300 ${
                  isScrolled ? 'scale-95' : 'scale-100'
                }`}
                width={48}
                height={48}
                title="Logo De La République Du Mali"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight transition-all duration-300">
                <span className="text-green-400">Ambassade</span>
                <span className="text-yellow-300"> Du Mali</span>
                <span className="text-red-500"> Au Maroc</span>
              </span>
              <span className="inline-block text-xs sm:text-sm md:text-base text-black mt-1 leading-tight truncate transition-all duration-300">
                UN PEUPLE - UN BUT - UNE FOI
              </span>
            </div>
          </Link>

          {/* Bouton menu mobile avec animation */}
          <button
            ref={menuButtonRef}
            onClick={toggleMobileMenu}
            className="p-3 -m-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 transition-all duration-300 lg:hidden shrink-0"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Ouvrir ou fermer le menu de navigation"
          >
            {isMobileMenuOpen ? (
              <FaTimes
                className={`h-6 w-6 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'rotate-180 scale-110 opacity-100'
                    : 'rotate-0 scale-100 opacity-90'
                }`}
              />
            ) : (
              <FaBars
                className={`h-6 w-6 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'rotate-180 scale-110 opacity-100'
                    : 'rotate-0 scale-100 opacity-90'
                }`}
              />
            )}
          </button>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center space-x-2 shrink-0 ml-8">
            {navItems.map(item => (
              <Link
                key={item.to}
                href={item.to}
                className={`group relative flex items-center space-x-3 px-5 py-3 text-base font-medium text-black hover:text-green-700 transition-all duration-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                  isActive(item.to) ? 'text-green-600' : ''
                }`}
              >
                {item.icon}
                <span className="text-lg transition-all duration-300">
                  {item.label}
                </span>
                {isActive(item.to) && (
                  <span className="absolute bottom-2 right-5 w-3 h-3 border-b-2 border-r-2 border-green-400 rounded-bl transition-all duration-300" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Menu mobile avec animations améliorées */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`absolute top-full left-0 right-0 mt-2 mx-4 lg:hidden bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 transition-all duration-300 ease-out ${
            isMobileMenuOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="py-2" id="mobile-menu-title" hidden>
            Menu de navigation
          </div>
          <nav className="py-2">
            {navItems.map(item => (
              <Link
                key={item.to}
                href={item.to}
                className={`flex items-center justify-between px-5 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-gray-100 active:bg-gray-100 relative ${
                  isActive(item.to) ? 'text-green-600' : ''
                }`}
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-4">
                  {React.isValidElement(item.icon) &&
                    (React.isValidElement(item.icon)
                      ? React.cloneElement(
                          item.icon as React.ReactElement<any, any>,
                          {
                            className: [
                              (item.icon.props &&
                                (item.icon.props as { className?: string })
                                  .className) ||
                                '',
                              'h-6 w-6 text-green-600 shrink-0 transition-transform duration-300',
                            ]
                              .filter(Boolean)
                              .join(' '),
                          }
                        )
                      : null)}
                  <span className="transition-all duration-300">
                    {item.label}
                  </span>
                </div>
                {isActive(item.to) && (
                  <span
                    className="absolute bottom-2 right-5 w-3 h-3 border-b-2 border-r-2 border-green-400 rounded-bl transition-all duration-300"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
