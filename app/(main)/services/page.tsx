import Faq from '@/components/services/Faq';
import DocumentCheckList from '@/components/shared/DocumentCheckList';
import Mission from '@/components/shared/Mission';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Services - Ambassade Du Mali Au Maroc',
  description:
    "Découvrez les services offerts par l'ambassade du Mali au Maroc.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function ServicesPage() {
  return (
    <>
      <main className="flex flex-col mt-25">
        <Mission />
        <DocumentCheckList />
        <Faq />
      </main>
    </>
  );
}
