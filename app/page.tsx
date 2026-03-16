import { fetchProducts } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import GoalSection from '@/components/home/GoalSection';
import PartnersSection from '@/components/home/PartnersSection';
import LienHeClient from '@/components/contact/LienHeClient';

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
        <section id="lien-he" className="bg-white">
          {/* <LienHeClient /> */} 
        </section>
      </main>
      <Footer config={config} />
    </>
  );
}
