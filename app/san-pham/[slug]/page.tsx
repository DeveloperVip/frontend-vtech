import { fetchProductBySlug } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import { Phone, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const config = siteConfig;
  const product = await fetchProductBySlug(params.slug).catch(() => null);

  if (!product) return notFound();

  const formatPrice = (price: number | null, type: string) => {
    if (type === 'contact' || !price) return null;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <>
      <Navbar config={config} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Link href="/san-pham" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700 mb-6 transition">
          <ArrowLeft size={15} /> Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {product.thumbnail ? (
              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Chưa có ảnh</div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded-full mb-3">
                <Tag size={11} /> {product.category.name}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">{product.name}</h1>

            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Price */}
            <div className="mb-6">
              {formatPrice(product.price, product.priceType) ? (
                <p className="text-3xl font-bold text-primary-700">{formatPrice(product.price, product.priceType)}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-500">Liên hệ để biết giá</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <Link href="/lien-he"
                className="flex items-center gap-2 bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-800 transition">
                <Phone size={16} /> Liên hệ báo giá
              </Link>
              <Link href="/san-pham"
                className="flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-5 py-3 rounded-lg hover:bg-gray-50 transition">
                Xem thêm sản phẩm
              </Link>
            </div>

            {/* Contact info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
              <p className="font-medium mb-1">📞 Hotline: {config?.contact_phone || '024.6682.8899'}</p>
              <p>✉️ Email: {config?.contact_email || 'vitechs.jsc@gmail.com'}</p>
            </div>
          </div>
        </div>

        {/* Full content */}
        {product.content && (
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h2>
            <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.content }} />
          </div>
        )}
      </main>
      <Footer config={config} />
    </>
  );
}
