import Link from 'next/link';
import { Phone } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number | null;
  priceType: 'fixed' | 'contact';
  category?: { name: string };
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const formatPrice = (price: number | null, type: string) => {
    if (type === 'contact' || !price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <div className="w-16 h-1 bg-primary-700 mt-2 rounded" />
          </div>
          <Link href="/san-pham"
            className="text-primary-700 text-sm font-semibold hover:underline hidden md:block">
            Xem tất cả →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/san-pham/${p.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      Chưa có ảnh
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {p.category && (
                    <span className="text-xs text-primary-700 font-medium">{p.category.name}</span>
                  )}
                  <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`font-bold text-sm ${p.priceType === 'contact' ? 'text-gray-400' : 'text-primary-700'}`}>
                      {formatPrice(p.price, p.priceType)}
                    </span>
                    {p.priceType === 'contact' && (
                      <span className="flex items-center gap-1 text-xs text-white bg-primary-700 px-2 py-1 rounded-full">
                        <Phone size={10} /> Báo giá
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/san-pham" className="text-primary-700 text-sm font-semibold hover:underline">
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </div>
    </section>
  );
}
