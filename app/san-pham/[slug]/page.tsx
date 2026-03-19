import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchProducts, fetchReviews } from '@/services/publicService';
import ProductDetailClient from '@/components/products/ProductDetailClient';

export const revalidate = 60;

interface Props {
  params: { locale: string; slug: string };
}

export default async function SanPhamDetailLocalePage({ params }: Props) {
  const config = siteConfig;
  
  // Fetch product by slug
  const product = await fetchProductBySlug(params.slug);
  if (!product) return notFound();

  // Fetch related products and initial reviews
  let relatedProducts = [];
  let initialReviews = { data: [], pagination: { total: 0 } };

  try {
    const catId = product.categoryId || product.category?.id || product.category_id;
    if (catId) {
      const res = await fetchProducts({ categoryId: catId, limit: 13 });
      relatedProducts = (res.data || [])
        .filter((p: any) => String(p.id) !== String(product.id))
        .slice(0, 12);
    }
    
    if (relatedProducts.length === 0) {
      const res = await fetchProducts({ limit: 13 });
      relatedProducts = (res.data || [])
        .filter((p: any) => String(p.id) !== String(product.id))
        .slice(0, 12);
    }

    // Fetch initial reviews
    initialReviews = await fetchReviews(product.id, { limit: 10 }).catch(() => ({ data: [], pagination: { total: 0 } }));
  } catch (err) {
    console.error('Error fetching supplementary data:', err);
  }

  return (
    <>
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts} 
        initialReviews={initialReviews}
      />
      <Footer config={config} />
    </>
  );
}
