import { fetchProducts, fetchCategories } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductsClient from '@/components/products/ProductsClient';

export const revalidate = 60;

export const metadata = {
  title: 'Sản phẩm – Vitechs',
  description: 'Danh sách thiết bị đào tạo, giáo cụ trực quan của Vitechs.',
};

export default async function SanPhamPage() {
  const config = siteConfig;
  const [categoriesData, productsData] = await Promise.all([
    fetchCategories().catch(() => []),
    fetchProducts({ limit: 12, page: 1 }).catch(() => ({ data: [], pagination: { total: 0, totalPages: 1 } })),
  ]);

  return (
    <>
      <Navbar config={config} />
      <main>
        {/* Page header */}
        <div className="bg-primary-700 text-white py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold">Sản phẩm</h1>
            <p className="mt-1 text-primary-200 text-sm">Thiết bị đào tạo – Giáo cụ trực quan chuyên nghiệp</p>
          </div>
        </div>

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
