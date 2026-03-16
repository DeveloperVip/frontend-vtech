import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
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
      <Navbar config={config} />
      <main>
        <div className="bg-primary-700 text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">Liên hệ</h1>
            <p className="mt-1 text-primary-200 text-sm">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
        <LienHeClient />
      </main>
      <Footer config={config} />
    </>
  );
}
