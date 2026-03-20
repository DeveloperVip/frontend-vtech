import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import LienHeClient from '@/components/contact/LienHeClient';

export const revalidate = 60;

export const metadata = {
  title: 'Liên hệ – Vitechs',
  description: 'Liên hệ với Vitechs để được tư vấn giải pháp kỹ thuật chuyên nghiệp.',
};

export default async function LienHePage() {
  const config = siteConfig;

  return (
    <>
      <main className="bg-white min-h-screen">
        <LienHeClient />
      </main>
      <Footer config={config} />
    </>
  );
}
