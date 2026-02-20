import type { ReactNode } from 'react';
import '../globals.css';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export const metadata = {
  title: 'Ambassade',
  description: 'Site officiel de l\'ambassade du Mali au Maroc',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}
