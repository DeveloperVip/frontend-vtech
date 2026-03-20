'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  ChevronRight,
  Facebook,
  Twitter,
  Play,
  Info,
  Star,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductImage360 from './components/product-image-360';
import { ProductLikesService, ProductReviewsService } from '@/src/api/generated';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
  initialReviews: any;
}

export default function ProductDetailClient({ product, relatedProducts, initialReviews }: ProductDetailClientProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likesCount || 0);
  const [reviews, setReviews] = useState<any[]>(initialReviews?.data || []);
  const [reviewsCount, setReviewsCount] = useState(initialReviews?.pagination?.total || 0);
  const [ratingAvg, setRatingAvg] = useState(product.ratingAvg || 0);
  const [activeImg, setActiveImg] = useState(product.thumbnail);
  const [show360, setShow360] = useState(false);
  const thumbsRef = React.useRef<HTMLDivElement>(null);

  const scrollThumbs = (direction: 'left' | 'right') => {
    if (thumbsRef.current) {
      const scrollAmount = 300;
      thumbsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  useEffect(() => {
    if (product.likesCount !== undefined) setLikesCount(product.likesCount);
  }, [product.id, product.likesCount]);

  const formatPrice = (price: number | null) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const discount = 22;
  const originalPrice = product.price ? product.price / (1 - discount / 100) : null;

  const handleLike = async () => {
    try {
      const res = await ProductLikesService.postProductsLike(product.id);
      console.log('Like response:', res);
      setIsLiked(!!res.data?.isLiked);
      setLikesCount(res.data?.likesCount ?? 0);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleShareZalo = () => {
    window.open(`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    email: '',
    rating: 5,
    content: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      // Import submitReview dynamically or from publicService if needed
      // Actually, I'll assume it's imported at the top if I add it.
      // For now, I'll log and show success to verify UI.
      const { submitReview } = await import('@/services/publicService');
      await submitReview(product.id, reviewForm);
      setReviewSuccess(true);
      setReviewForm({ userName: '', email: '', rating: 5, content: '' });
      // Optionally re-fetch reviews or add the new one locally
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#f5f7fa] min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[13px] text-gray-600 mb-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <a href="/" className="hover:text-[#2b59ff] transition-colors">Trang Chủ</a>
          <ChevronRight size={12} className="text-gray-400" />
          <a href="/san-pham" className="hover:text-[#2b59ff] transition-colors">Sản Phẩm</a>
          {product.category && (
            <>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="text-gray-500 truncate">{product.category.name}</span>
            </>
          )}
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-400 truncate font-medium text-gray-900">{product.name}</span>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white rounded-2xl shadow-sm flex flex-col md:flex-row gap-8 p-5 md:p-8 overflow-hidden border border-gray-100">

          <div className="w-full md:w-[480px] shrink-0">
            <div className="relative aspect-square border border-gray-100 rounded-xl overflow-hidden bg-white mb-4 group shadow-inner">
              {show360 && product.images && product.images.length > 3 ? (
                <ProductImage360 images360={product.images} />
              ) : (
                <ProductImage360 
      images360={[
        "/slider/360-product-photography-575px01.jpg",
        "/slider/360-product-photography-575px02.jpg",
        "/slider/360-product-photography-575px03.jpg",
        "/slider/360-product-photography-575px04.jpg",
        "/slider/360-product-photography-575px06.jpg",
        "/slider/360-product-photography-575px08.jpg",
        "/slider/360-product-photography-575px09.jpg",
        "/slider/360-product-photography-575px11.jpg",
        "/slider/360-product-photography-575px12.jpg",
        "/slider/360-product-photography-575px14.jpg",
        "/slider/360-product-photography-575px16.jpg",
        "/slider/360-product-photography-575px18.jpg",
        "/slider/360-product-photography-575px20.jpg",
        "/slider/360-product-photography-575px22.jpg",
        "/slider/360-product-photography-575px23.jpg",
        "/slider/360-product-photography-575px25.jpg",
        "/slider/360-product-photography-575px27.jpg",
      ]} 
      />
              )}

              {product.images && product.images.length > 3 && (
                <button
                  onClick={() => setShow360(!show360)}
                  className="absolute bottom-4 right-4 bg-white/90 text-[#2b59ff] p-3 rounded-full shadow-lg backdrop-blur-sm hover:bg-[#2b59ff] hover:text-white transition-all transform hover:scale-110 active:scale-95 z-10"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              )}
            </div>

            <div className="relative group/thumbs">
              <div
                ref={thumbsRef}
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
              >
                {[product.thumbnail, ...(product.images || [])].filter(Boolean).map((img, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => { setActiveImg(img); setShow360(false); }}
                    onClick={() => { setActiveImg(img); setShow360(false); }}
                    className={`relative w-16 h-16 min-w-[64px] aspect-square border-2 rounded-lg cursor-pointer overflow-hidden transition-all duration-300 ${activeImg === img ? 'border-[#2b59ff] shadow-md ring-2 ring-[#2b59ff]/10' : 'border-gray-100 hover:border-[#2b59ff]/30'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    {activeImg === img && (
                      <div className="absolute inset-0 bg-[#2b59ff]/5 pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>

              {/* Thumbnail Nav Buttons */}
              <button
                onClick={() => scrollThumbs('left')}
                className="absolute left-0 top-1/2 -translate-y-[calc(50%+8px)] w-8 h-16 bg-black/20 text-white flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity z-10 rounded-r-sm"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <button
                onClick={() => scrollThumbs('right')}
                className="absolute right-0 top-1/2 -translate-y-[calc(50%+8px)] w-8 h-16 bg-black/20 text-white flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity z-10 rounded-l-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-10 border-t border-gray-50 pt-6">
              <div className="flex items-center gap-3">
                <Star size={20} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-[#1a1c1e]">Đánh giá ({reviewsCount})</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-[#1a1c1e] hover:opacity-80 transition group py-1"
              >
                <Heart size={22} className={isLiked ? 'text-[#ff424e] fill-[#ff424e]' : 'text-gray-400 group-hover:text-[#ff424e]'} />
                <span className="text-sm font-bold">Đã thích ({likesCount})</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col pt-2">
            {product.category && (
              <div className="mb-4">
                <span className="bg-[#e0efff] text-[#2b59ff] text-[12px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-[#2b59ff]/10">
                  {product.category.name}
                </span>
              </div>
            )}

            <h1 className="text-3xl font-extrabold text-[#1a1c1e] mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-xl">
              {product.description || 'Sản phẩm giải pháp kỹ thuật cao cấp, được thiết kế chuyên dụng đáp ứng các tiêu chuẩn khắt khe nhất trong ngành đào tạo và công nghiệp.'}
            </p>

            <div className="bg-[#f9f5ff] rounded-[1.5rem] p-6 mb-10 border border-[#b22bff]/10">
              <div className="flex flex-col gap-1 mb-2">
                <span className="text-gray-500 text-[13px] font-medium">Giá sản phẩm</span>
                <span className="text-3xl md:text-4xl font-black text-[#2b59ff] tracking-tight">
                  {product.priceType !== 'contact' ? formatPrice(product.price) : 'Liên hệ để báo giá'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#10b981] font-bold text-[14px]">
                <Check size={16} /> Còn hàng - Sẵn sàng giao
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[18px] font-bold text-[#1a1c1e] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2b59ff]" />
                Đặc Điểm Nổi Bật
              </h3>
              <ul className="space-y-4">
                {(product.features || [
                  'Sản phẩm chất năng cao cấp chính hãng',
                  'Thiết kế tối ưu, độ bền vượt trội',
                  'Hỗ trợ kỹ thuật 24/7',
                  'Dễ dàng lắp đặt và vệ sinh',
                  'Bảo hành 2 năm'
                ]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-[#1a1c1e] text-[15px] font-medium">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#dcfce7] flex items-center justify-center shadow-sm">
                      <Check size={14} className="text-[#10b981]" strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4 mb-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-customer-chat'))}
                  className="w-full h-14 rounded-full bg-gradient-to-r from-[#2b59ff] to-[#bb2bff] text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-200 hover:shadow-xl hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  <MessageSquare size={22} className="rotate-0" />
                  LIÊN HỆ ĐỂ MUA HÀNG
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <a href="/lien-he" className="h-14 border border-blue-600 text-blue-600 font-bold rounded-full flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95 shadow-sm">
                    <ShoppingCart size={20} />
                    Yêu Cầu Báo Giá
                  </a>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="h-14 border border-gray-200 text-gray-600 font-bold rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                  >
                    <Share2 size={20} />
                    Chia Sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100">
          <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-[#2b59ff] mb-10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">MÔ TẢ SẢN PHẨM</h2>
            <div className="h-px flex-1 bg-gray-200 mx-6 opacity-50 hidden md:block" />
          </div>

          <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line px-2">
            <div dangerouslySetInnerHTML={{ __html: product.content || product.description }} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="bg-white p-4 rounded-xl border-l-4 border-[#2b59ff] mb-8 flex items-center justify-between shadow-sm border border-gray-100/50">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Sản Phẩm Liên Quan</h2>
              <div className="h-px flex-1 bg-gray-200 mx-6 opacity-30 hidden md:block" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {relatedProducts.map(p => (
                <a
                  key={p.id}
                  href={`/san-pham/${p.slug}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group flex flex-col h-full active:scale-[0.98]"
                >
                  <div className="aspect-square bg-white overflow-hidden p-2">
                    <img src={p.thumbnail} alt={p.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#2b59ff] transition-colors mb-2">{p.name}</h3>
                    <div className="mt-auto">
                      <span className="text-[#2b59ff] text-lg font-black tracking-tight">{formatPrice(p.price)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Product Reviews */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100">
          <div className="bg-gray-50/50 p-5 rounded-xl border-l-4 border-[#2b59ff] mb-10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">ĐÁNH GIÁ SẢN PHẨM</h2>
            <div className="flex items-center gap-2">
               <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={`${star <= Math.round(ratingAvg) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  ))}
               </div>
               <span className="text-sm font-bold text-gray-900">{ratingAvg.toFixed(1)}/5</span>
               <span className="text-sm text-gray-500">({reviewsCount} đánh giá)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div key={i} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2b59ff]/10 flex items-center justify-center text-[#2b59ff] font-bold">
                          {r.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{r.userName}</div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={10} className={`${star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(r.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-[52px]">{r.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">Chưa có đánh giá nào cho sản phẩm này.</p>
                  <p className="text-sm text-gray-400">Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 h-fit shadow-inner ring-1 ring-black/5">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Gửi đánh giá của bạn</h3>
              
              {reviewSuccess ? (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center border border-emerald-100">
                  <Check className="mx-auto mb-2" size={24} />
                  <p className="font-bold">Cảm ơn bạn đã đánh giá!</p>
                  <p className="text-sm opacity-80">Phản hồi của bạn đã được ghi nhận.</p>
                  <button 
                    onClick={() => setReviewSuccess(false)}
                    className="mt-4 text-xs font-bold underline"
                  >
                    Gửi thêm đánh giá khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Điểm đánh giá</label>
                    <div className="flex items-center gap-1.5 bg-white p-3 rounded-xl border border-gray-200">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          className="hover:scale-125 transition-transform"
                        >
                          <Star size={24} className={`${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Họ tên</label>
                      <input 
                        type="text" 
                        required
                        value={reviewForm.userName}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b59ff]/20 placeholder:text-gray-300 transition-all font-medium"
                        placeholder="Nhập họ tên " 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                      <input 
                        type="email" 
                        required
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b59ff]/20 placeholder:text-gray-300 transition-all font-medium"
                        placeholder="email@gmail.com" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nội dung</label>
                    <textarea 
                      rows={4} 
                      required
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b59ff]/20 placeholder:text-gray-300 transition-all font-medium resize-none"
                      placeholder="Đánh giá của bạn về sản phẩm này..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-[#2b59ff] hover:bg-[#1a47ff] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Gửi Đánh Giá
                        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Play size={24} className="rotate-45" />
              </button>

              <h3 className="text-xl font-black text-gray-900 mb-6 text-center">CHIA SẺ SẢN PHẨM</h3>

              <div className="grid grid-cols-3 gap-6">
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    {copied ? <Check size={24} /> : <Share2 size={24} />}
                  </div>
                  <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tighter">
                    {copied ? 'Đã sao chép' : 'Copy link'}
                  </span>
                </button>

                <button
                  onClick={handleShareFB}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all shadow-sm">
                    <Facebook size={24} fill="currentColor" />
                  </div>
                  <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tighter">Facebook</span>
                </button>

                <button
                  onClick={handleShareZalo}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                    <div className="font-black text-lg">Z</div>
                  </div>
                  <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tighter">Zalo</span>
                </button>
              </div>

              {copied && (
                <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3 text-green-700 font-bold text-sm animate-bounce">
                  <Check size={18} /> Đã sao chép đường dẫn!
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
