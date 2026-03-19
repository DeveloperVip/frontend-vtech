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
import ContactSection from '@/components/home/ContactSection';
import CustomerFeedback from '@/components/home/CustomerFeedback';
import NextTopLoader from 'nextjs-toploader';

export const revalidate = 60;

export default async function Home() {
  const productsData = await fetchProducts({ featured: 'true', limit: 8 }).catch(() => ({ data: [] }));
  const config = siteConfig;

  return (
    <>
      <main>
        <NextTopLoader
          color="#2563EB"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #2563EB,0 0 5px #2563EB"
        />
        <HeroSection config={config} />
        <AboutSection config={config} />
        <GoalSection />
        <FeaturedProducts products={productsData.data || []} />
        <CustomerFeedback />
        <PartnersSection />
        <ContactSection />
        <section id="lien-he" className="bg-white">
          {/* <LienHeClient /> */}
        </section>
      </main>
      <Footer config={config} />
    </>
  );
}
