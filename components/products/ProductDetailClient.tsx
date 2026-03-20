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
  Send,
  X,
  Plus
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const pageSize = 5;

  const handlePageChange = async (page: number) => {
    setLoadingReviews(true);
    setCurrentPage(page);
    try {
      const { fetchReviews } = await import('@/services/publicService');
      const res = await fetchReviews(product.id, { page, limit: pageSize });
      setReviews(res.data || []);
      // Scroll to reviews section
      const reviewsElement = document.getElementById('product-reviews');
      if (reviewsElement) {
        const yOffset = -100; // Offset to keep the header visible
        const y = reviewsElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };
  const [ratingAvg, setRatingAvg] = useState(() => {
    if (product.ratingAvg > 0) return product.ratingAvg;
    if (initialReviews?.data?.length > 0) {
      const sum = initialReviews.data.reduce((acc: number, r: any) => acc + r.rating, 0);
      return sum / initialReviews.data.length;
    }
    return 0;
  });
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
  const [reviewImages, setReviewImages] = useState<{ url: string; width?: number; height?: number }[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'userName') {
      if (!value.trim()) {
        error = 'Vui lòng nhập họ tên của bạn';
      } else {
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        if (!nameRegex.test(value)) {
          error = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
        }
      }
    } else if (name === 'email') {
      if (!value.trim()) {
        error = 'Vui lòng nhập email của bạn';
      } else if (!value.includes('@')) {
        error = 'Email hợp lệ cần có ký tự @';
      }
    } else if (name === 'content') {
      if (!value.trim()) {
        error = 'Vui lòng nhập nội dung đánh giá';
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const e1 = validateField('userName', reviewForm.userName);
    const e2 = validateField('email', reviewForm.email);
    const e3 = validateField('content', reviewForm.content);

    if (e1 || e2 || e3) return;

    setSubmittingReview(true);
    try {
      const { submitReview } = await import('@/services/publicService');
      const res = await submitReview(product.id, {
        ...reviewForm,
        images: reviewImages
      });

        if (res.success) {
        setReviewSuccess(true);
        // Add new review to local state
        const newReview = res.data;
        
        // Recalculate average rating
        const newCount = reviewsCount + 1;
        const newAvg = (ratingAvg * reviewsCount + newReview.rating) / newCount;
        setRatingAvg(newAvg);
        setReviewsCount(newCount);

        if (currentPage === 1) {
          setReviews((prev: any[]) => [newReview, ...prev].slice(0, pageSize));
        } else {
          handlePageChange(1);
        }

        // Reset form
        setReviewForm({ userName: '', email: '', rating: 5, content: '' });
        setReviewImages([]);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewImageUpload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/upload/public`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        setReviewImages((prev: any[]) => [...prev, { url: data.url, width: data.width, height: data.height }]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  // Related Products Scroll Logic
  const relatedRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (relatedRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = relatedRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [relatedProducts]);

  // Thumbnail Scroll Logic
  const [canScrollLeftThumbs, setCanScrollLeftThumbs] = useState(false);
  const [canScrollRightThumbs, setCanScrollRightThumbs] = useState(false);

  const checkScrollThumbs = () => {
    if (thumbsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbsRef.current;
      setCanScrollLeftThumbs(scrollLeft > 5);
      setCanScrollRightThumbs(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollThumbs();
    window.addEventListener('resize', checkScrollThumbs);
    return () => window.removeEventListener('resize', checkScrollThumbs);
  }, [product.images, product.thumbnail]);

  // Zoom effect logic
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
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
            <div 
              className="relative aspect-square border border-gray-100 rounded-xl overflow-hidden bg-white mb-4 group shadow-inner cursor-zoom-in"
              onClick={() => setSelectedLightboxImage(activeImg)}
            >
              {show360 && product.images && product.images.length > 3 ? (
                <ProductImage360 images360={product.images} />
              ) : (
                <img
                  src={activeImg}
                  className="w-full h-full object-contain p-4"
                  alt={product.name}
                />
              )}

              {product.images && product.images.length > 5 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShow360(!show360); }}
                  className="absolute bottom-4 right-4 bg-white/90 text-[#2b59ff] p-3 rounded-full shadow-lg backdrop-blur-sm hover:bg-[#2b59ff] hover:text-white transition-all transform hover:scale-110 active:scale-95 z-10"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              )}
            </div>

            <div className="relative group/thumbs">
              <div
                ref={thumbsRef}
                onScroll={checkScrollThumbs}
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
              {canScrollLeftThumbs && (
                <button
                  onClick={() => scrollThumbs('left')}
                  className="absolute left-[-20px] top-1/2 -translate-y-[calc(50%+8px)] w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-50 transition-all z-10"
                >
                  <ChevronRight className="rotate-180" size={20} />
                </button>
              )}
              {canScrollRightThumbs && (
                <button
                  onClick={() => scrollThumbs('right')}
                  className="absolute right-[-20px] top-1/2 -translate-y-[calc(50%+8px)] w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-50 transition-all z-10"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-10 border-t border-gray-50 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className={`${star <= Math.round(ratingAvg) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#1a1c1e]">{ratingAvg.toFixed(1)}/5 ({reviewsCount})</span>
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
          <div className="mt-16 bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100 relative group/related">
            <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-[#2b59ff] mb-10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">SẢN PHẨM LIÊN QUAN</h2>
              <div className="h-px flex-1 bg-gray-200 mx-6 opacity-50 hidden md:block" />
            </div>

            <div className="relative">
              <div
                ref={relatedRef}
                onScroll={checkScroll}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              >
                {relatedProducts.map(p => (
                  <a
                    key={p.id}
                    href={`/san-pham/${p.slug}`}
                    className="min-w-[220px] w-[220px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group flex flex-col h-full active:scale-[0.98]"
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

              {canScrollLeft && (
                <button
                  onClick={() => {
                    if (relatedRef.current) relatedRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-50 transition-all z-10"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
              )}
              {canScrollRight && (
                <button
                  onClick={() => {
                    if (relatedRef.current) relatedRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-50 transition-all z-10"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Product Reviews */}
        <div id="product-reviews" className="mt-16 bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100">
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
            <div className={`lg:col-span-2 space-y-8 ${loadingReviews ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-300 relative`}>
              {loadingReviews && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-[#2b59ff]/20 border-t-[#2b59ff] rounded-full animate-spin"></div>
                </div>
              )}
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
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-[52px] mb-4">{r.content}</p>
                    {r.ProductReviewImages && r.ProductReviewImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-[52px]">
                        {r.ProductReviewImages.map((img: any, idx: number) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedLightboxImage(img.url)}
                            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in hover:scale-105 transition-transform"
                          >
                            <img src={img.url} className="w-full h-full object-cover" alt="" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">Chưa có đánh giá nào cho sản phẩm này.</p>
                  <p className="text-sm text-gray-400">Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
                </div>
              )}

              {/* Pagination UI */}
              {reviewsCount > pageSize && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loadingReviews}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2b59ff] hover:text-[#2b59ff] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all shadow-sm bg-white"
                  >
                    <ChevronRight className="rotate-180" size={18} />
                  </button>
                  
                  {Array.from({ length: Math.ceil(reviewsCount / pageSize) }).map((_, i) => {
                    const page = i + 1;
                    const totalPages = Math.ceil(reviewsCount / pageSize);
                    
                    // Show first, last, current, and neighbors
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loadingReviews}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === page ? 'bg-[#2b59ff] text-white shadow-lg shadow-blue-200 animate-in zoom-in-75 duration-300' : 'text-gray-500 hover:bg-gray-100 hover:text-[#2b59ff]'}`}
                        >
                          {page}
                        </button>
                      );
                    }
                    
                    // Show dots
                    if (
                      (page === 2 && currentPage > 3) || 
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={page} className="text-gray-300 px-1">...</span>;
                    }

                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(reviewsCount / pageSize) || loadingReviews}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#2b59ff] hover:text-[#2b59ff] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all shadow-sm bg-white"
                  >
                    <ChevronRight size={18} />
                  </button>
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
                    <div className="flex items-center gap-1.5 mb-2 ml-1">
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
                        onChange={(e) => {
                          setReviewForm(prev => ({ ...prev, userName: e.target.value }));
                          if (errors.userName) validateField('userName', e.target.value);
                        }}
                        onBlur={(e) => validateField('userName', e.target.value)}
                        className={`w-full bg-white border ${errors.userName ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b59ff]/20 placeholder:text-gray-300 transition-all font-medium`}
                        placeholder="Nhập họ tên "
                      />
                      {errors.userName && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.userName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                      <input
                        type="email"
                        required
                        value={reviewForm.email}
                        onChange={(e) => {
                          setReviewForm(prev => ({ ...prev, email: e.target.value }));
                          if (errors.email) validateField('email', e.target.value);
                        }}
                        onBlur={(e) => validateField('email', e.target.value)}
                        className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b59ff]/20 placeholder:text-gray-300 transition-all font-medium`}
                        placeholder="email@gmail.com"
                      />
                      {errors.email && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nội dung</label>
                    <textarea
                      rows={4}
                      required
                      value={reviewForm.content}
                      onChange={(e) => {
                        setReviewForm(prev => ({ ...prev, content: e.target.value }));
                        if (errors.content) validateField('content', e.target.value);
                      }}
                      onBlur={(e) => validateField('content', e.target.value)}
                      className={`w-full bg-white border ${errors.content ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b59ff]/20 placeholder:text-gray-300 transition-all font-medium resize-none shadow-sm`}
                      placeholder="Đánh giá của bạn về sản phẩm này..."
                    ></textarea>
                    {errors.content && <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.content}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Hình ảnh thực tế (tùy chọn)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {reviewImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                          <button
                            type="button"
                            onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      ))}
                      {reviewImages.length < 5 && (
                        <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#2b59ff] hover:bg-white transition-all">
                          <Plus size={20} className="text-gray-400" />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              files.forEach(handleReviewImageUpload);
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Chọn tối đa 5 ảnh thực tế của sản phẩm.</p>
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
                <X size={24} />
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
      {/* Lightbox for images */}
      <AnimatePresence>
        {selectedLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
              onClick={() => setSelectedLightboxImage(null)}
            >
              <X size={28} />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedLightboxImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
