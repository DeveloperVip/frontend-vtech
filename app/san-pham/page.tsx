import { fetchCategories } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import ProductsClient from '@/components/products/ProductsClient';
import AnimatedHeader from '@/components/layout/AnimatedHeader';
import { ProductsService } from '@/src/api/generated';

export const revalidate = 60;

export const metadata = {
  title: 'Sản phẩm – Vitechs',
  description: 'Danh sách thiết bị đào tạo, giáo cụ trực quan của Vitechs.',
};

export default async function SanPhamPage() {
  const config = siteConfig;
  const [categoriesData, productsData] = await Promise.all([
    fetchCategories().catch(() => []),
    ProductsService.getProducts(),
  ]);

  return (
    <>
      <main>
        <AnimatedHeader title="Tất Cả Sản Phẩm" subtitle="Thiết bị đào tạo – Giáo cụ trực quan chuyên nghiệp" />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <ProductsClient
            initialProducts={productsData.data || []}
            initialPagination={productsData.pagination || { total: 0, totalPages: 1, page: 1, limit: 12 }}
            categories={categoriesData || []}
          />
        </div>
      </main>
      <Footer config={config} />
    </>
  );
}
