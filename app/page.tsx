import { fetchProducts } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import GoalSection from '@/components/home/GoalSection';
import PartnersSection from '@/components/home/PartnersSection';
import ContactPage from '@/components/contact/ContactPage';

export const revalidate = 60;

export default async function Home() {
  const productsData = await fetchProducts({ featured: 'true', limit: 8 }).catch(() => ({ data: [] }));
  const config = siteConfig;

  return (
    <>
      <Navbar config={config} />
      <main>
        <HeroSection config={config} />
        <AboutSection config={config} />
        <FeaturedProducts products={productsData.data || []} />
        <GoalSection />
        <PartnersSection />
        <section id="lien-he" className="py-20 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Kết nối với Vitechs</h2>
              <div className="w-16 h-1 bg-primary-700 mx-auto mt-2 rounded" />
              <p className="mt-3 text-gray-500 text-sm">
                Để lại thông tin và chúng tôi sẽ liên hệ hỗ trợ bạn sớm nhất.
              </p>
            </div>
            <ContactPage />
          </div>
        </section>
      </main>
      <Footer config={config} />
    </>
  );
}
