'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from '@/hooks/useUserAuthStore';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LikedProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated } = useUserAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchLikedProducts();
  }, [isAuthenticated]);

  const fetchLikedProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/liked`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error('Không thể tải danh sách yêu thích');
      }
    } catch (error) {
      console.error('Error fetching liked products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12 min-h-[70vh]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" />
            Sản phẩm đã thích
          </h1>
          <p className="text-gray-500 mt-2">Danh sách các sản phẩm bạn đã lưu lại để tham khảo</p>
        </div>
        <Link 
            href="/san-pham" 
            className="text-primary-600 font-semibold hover:underline flex items-center gap-2"
        >
            Tiếp tục mua sắm <ArrowRight size={18} />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-16 text-center border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Hãy khám phá các sản phẩm của VITECHS và nhấn nút yêu thích để lưu lại tại đây nhé!
          </p>
          <Link 
            href="/san-pham"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            Khám phá ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <Link href={`/san-pham/${item.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={item.thumbnail || (item.images?.[0]?.url) || '/placeholder.png'} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
              <div className="p-5">
                <div className="text-xs text-primary-600 font-bold mb-2 uppercase tracking-wider">
                  {item.category?.name || 'Sản phẩm'}
                </div>
                <Link href={`/san-pham/${item.slug}`} className="block text-lg font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                  {item.name}
                </Link>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-lg font-extrabold text-blue-600">
                    {item.price ? new Intl.NumberFormat('vi-VN').format(item.price) + 'đ' : 'Liên hệ'}
                  </div>
                  <button 
                    className="p-2.5 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    title="Bỏ thích"
                    onClick={async (e) => {
                        e.preventDefault();
                        // Call like API to toggle off
                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/products/${item.id}/like`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                                setProducts(products.filter(p => p.id !== item.id));
                                toast.success('Đã bỏ yêu thích');
                            }
                        } catch (err) {}
                    }}
                  >
                    <Heart size={20} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
