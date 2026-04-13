'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { adminGet, adminPost, adminPut } from '@/services/adminService';
import ImageUpload from '@/components/ui/ImageUpload';
import FileUpload from '@/components/ui/FileUpload';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import { Trash2, Box, RotateCcw, Sparkles, UploadCloud, Loader2, Images, Plus } from 'lucide-react';
import { ProductModel3DService } from '@/src/api/generated/services/ProductModel3DService';
import { ProductsService } from '@/src/api/generated/services/ProductsService';
import { UploadService } from '@/src/api/generated/services/UploadService';
import { OpenAPI } from '@/src/api/generated/core/OpenAPI';
import ProductModelViewer from '@/components/products/components/product-model-viewer';
import ProductImage360 from '@/components/products/components/product-image-360';

interface Category { id: number; name: string; }

export default function ProductFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState({
    name: '', description: '', price: '', priceType: 'contact',
    thumbnail: '', categoryId: '', isFeatured: false, isActive: true,
    metaTitle: '', metaDescription: '',
    additionalInfo: [] as { id?: number; name: string; value: string; sortOrder: number }[],
    model3DId: null as number | null,
    images: [] as string[],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [model3D, setModel3D] = useState({
    modelUrl: '',
    poster: '',
    images360: [] as string[],
    sourceViews: {} as Record<string, string>,
    format: 'glb'
  });
  const [model3DOption, setModel3DOption] = useState<'upload_glb' | 'generate' | 'images_360'>('upload_glb');
  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState('');
  const [genViews, setGenViews] = useState<Record<string, string>>({
    front: '', back: '', left: '', right: '',
  });
  const [genModelId, setGenModelId] = useState<number | null>(null);
  const [genTimer, setGenTimer] = useState(0);
  const [genProgress, setGenProgress] = useState(0);
  const [genMessageIndex, setGenMessageIndex] = useState(0);

  const GEN_MESSAGES = [
    "Khởi tạo quy trình AI...",
    "Phân tích cấu trúc hình ảnh...",
    "Trích xuất đặc điểm chiều sâu...",
    "Dựng khung lưới 3D (Mesh)...",
    "Ánh xạ vật liệu màu sắc...",
    "Tối ưu hóa các bề mặt...",
    "Kiểm tra chất lượng mô hình...",
    "Tạo tệp GLB tiêu chuẩn...",
    "Sắp hoàn tất, vui lòng chờ giây lát...",
    "Đang chuẩn bị dữ liệu xem trước..."
  ];

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<NodeJS.Timeout | null>(null);
  const SLOTS = [
    { key: 'front', label: 'Mặt trước', required: true },
    { key: 'back', label: 'Mặt sau', required: false },
    { key: 'left', label: 'Bên trái', required: false },
    { key: 'right', label: 'Bên phải', required: false },
  ];
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGet('/categories').then((res) => setCategories(res.data || []));
    if (!isNew) {
      adminGet(`/products/${params.id}`).then((res) => {
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price ? String(p.price) : '',
          priceType: p.priceType || 'contact',
          thumbnail: p.thumbnail || '',
          categoryId: p.categoryId ? String(p.categoryId) : '',
          isFeatured: p.isFeatured || false,
          isActive: p.isActive !== false,
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          additionalInfo: p.additionalInfo || [],
          model3DId: p.model3DId || null,
          images: p.images || [],
        });
      });
      // Fetch 3D model
      ProductModel3DService.getProductsModel3D(Number(params.id))
        .then((res) => {
          if (res.data) {
            const m = res.data;
            setModel3D({
              modelUrl: m.modelUrl || '',
              poster: m.poster || '',
              images360: m.images360 || [],
              sourceViews: m.sourceViews || {},
              format: m.format || 'glb',
            });
            if (m.sourceViews) {
              setGenViews(prev => ({ ...prev, ...m.sourceViews }));
            }
            if (m.id) {
              f('model3DId', m.id);
              setGenModelId(m.id);
            }
          }
        })
        .catch(() => console.log('Sản phẩm chưa có mô hình 3D'));
    } else {
      // Kiểm tra sessionStorage cho sản phẩm mới
      const savedModelId = sessionStorage.getItem('lastGenModelId');
      if (savedModelId) {
        const modelId = Number(savedModelId);
        setGenModelId(modelId);
        f('model3DId', modelId);
        // Lấy status và sourceViews từ backend cho task preview này
        ProductsService.getProducts3DStatus1(modelId).then((res: any) => {
          if (res.data) {
            if (res.data.sourceViews) {
              setGenViews(prev => ({ ...prev, ...res.data.sourceViews }));
            }
            if (res.data.status === 'processing' || res.data.status === 'pending') {
              setGenerating(true);
              setGenStatus('Đang khôi phục tiến trình...');
              startPolling(modelId);
            }
          }
        });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      };
      if (isNew) {
        const res = await adminPost('/products', payload);
        const newId = res.data.id;
        // Save 3D model for new product if not generated (if generated, it's already linked via model3DId)
        if (!form.model3DId && (model3D.modelUrl || model3D.images360.length > 0)) {
          await ProductModel3DService.putProductsModel3D(newId, model3D);
        } else if (form.model3DId && model3D.images360.length > 0) {
          // If generated, we might still want to update other fields like images360
          await ProductModel3DService.putProductsModel3D(newId, model3D);
        }
      } else {
        await adminPut(`/products/${params.id}`, payload);
        // Save 3D model for existing product (including sourceViews)
        await ProductModel3DService.putProductsModel3D(Number(params.id), model3D);
      }
      router.push('/admin/products');
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Lỗi lưu dữ liệu');
      setLoading(false);
    }
  };

  const stopGenerationUI = () => {
    setGenerating(false);
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    if (messageRef.current) clearInterval(messageRef.current);
  };

  const startPolling = (modelId: number) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    const poll = async () => {
      try {
        const statusData = await ProductsService.getProducts3DStatus1(modelId);
        const { status, modelUrl, errorMessage } = (statusData as any).data ?? {};

        if (status === 'succeeded') {
          setGenStatus('Hoàn tất!');
          fm('modelUrl', modelUrl);
          stopGenerationUI();
          setGenProgress(100);
        } else if (status === 'failed') {
          setError('Tạo 3D thất bại: ' + (errorMessage || 'Lỗi không xác định'));
          stopGenerationUI();
        } else {
          setGenStatus(
            status === 'processing'
              ? 'AI đang phân tích và dựng mô hình...'
              : 'Đang xếp hàng chờ xử lý...'
          );
        }
      } catch {
        // Bỏ qua lỗi mạng
      }
    };

    // Poll mỗi 5 giây
    pollingRef.current = setInterval(poll, 5000);
    // Dừng tối đa sau 10 phút
    setTimeout(() => {
      if (pollingRef.current) {
        setError('Quá thời gian chờ. Vui lòng thử lại.');
        stopGenerationUI();
      }
    }, 10 * 60 * 1000);

    poll(); // Thực hiện poll ngay lập tức
  };

  const handleGenerate3D = async () => {
    if (!genViews.front) {
      setError('Vui lòng tải lên ít nhất ảnh mặt trước');
      return;
    }

    const views = Object.fromEntries(
      Object.entries(genViews).filter(([_, url]) => !!url)
    ) as { front: string; back?: string; left?: string; right?: string };

    setGenerating(true);
    setGenStatus('Đang khởi tạo...');
    setGenTimer(0);
    setGenProgress(0);
    setGenMessageIndex(0);

    // Bắt đầu đếm giờ
    timerRef.current = setInterval(() => {
      setGenTimer(prev => prev + 1);
    }, 1000);

    // Bắt đầu tiến độ ảo
    progressRef.current = setInterval(() => {
      setGenProgress(prev => {
        if (prev < 90) return prev + Math.random() * 2;
        if (prev < 98) return prev + 0.1;
        return prev;
      });
    }, 2000);

    // Xoay vòng thông điệp
    messageRef.current = setInterval(() => {
      setGenMessageIndex(prev => (prev + 1) % GEN_MESSAGES.length);
    }, 10000);

    try {
      const res = await ProductsService.postProducts3DPreviewViews({ views });
      const modelId = res?.data?.modelId;
      if (!modelId) throw new Error('Không nhận được modelId');
      
      setGenModelId(modelId);
      f('model3DId', modelId);
      if (isNew) sessionStorage.setItem('lastGenModelId', String(modelId));

      startPolling(modelId);

    } catch {
      setError('Lỗi kết nối. Kiểm tra backend đang chạy.');
      stopGenerationUI();
    }
  };

  const handleUploadViewImage = async (slot: string, file: File) => {
    try {
      const { getToken } = await import('@/services/adminService');
      OpenAPI.TOKEN = getToken() ?? undefined;
      const data = await UploadService.postUpload({ file });
      if (data.url) {
        const newViews = { ...genViews, [slot]: data.url! };
        setGenViews(newViews);
        fm('sourceViews', newViews);

        // Lưu ngay để tránh mất khi reload
        try {
          const res = await ProductsService.postProducts3DStatusSaveViews({
            productId: !isNew ? Number(params.id) : null,
            views: newViews as any
          });
          if (res.data?.modelId) {
            setGenModelId(res.data.modelId);
            f('model3DId', res.data.modelId);
            if (isNew) {
              sessionStorage.setItem('lastGenModelId', String(res.data.modelId));
            }
          }
        } catch (err) {
          console.error('Lỗi lưu source views:', err);
        }
      } else {
        setError('Lỗi upload ảnh');
      }
    } catch {
      setError('Lỗi upload ảnh');
    }
  };

  const f = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));
  const fm = (field: string, value: any) => setModel3D((prev) => ({ ...prev, [field]: value }));

  const handleUploadProductImages = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const { getToken } = await import('@/services/adminService');
    OpenAPI.TOKEN = getToken() ?? undefined;
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const data = await UploadService.postUpload({ file: files[i] });
        if (data.url) newUrls.push(data.url);
        else setError('Upload thất bại');
      } catch {
        setError('Lỗi kết nối khi upload ảnh');
      }
    }
    if (newUrls.length > 0) {
      f('images', [...form.images, ...newUrls]);
    }
    setUploadingImages(false);
  };

  const handleRemoveProductImage = (index: number) => {
    f('images', form.images.filter((_, i) => i !== index));
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopGenerationUI();
    };
  }, []);

  return (
    <div className="">
      <div className='flex flex-row justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</h1>
      </div>
      {error && <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
        <div className='flex flex-row gap-20'>
          <div className='w-1/2 p-6 flex flex-col gap-5'>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
              <input className="input-field" value={form.name} onChange={(e) => f('name', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea className="input-field resize-none" rows={3} value={form.description} onChange={(e) => f('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu giá</label>
                <select className="input-field" value={form.priceType} onChange={(e) => f('priceType', e.target.value)}>
                  <option value="contact">Liên hệ</option>
                  <option value="fixed">Giá cố định</option>
                </select>
              </div>
              {form.priceType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                  <input type="number" className="input-field" value={form.price} onChange={(e) => f('price', e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select className="input-field" value={form.categoryId} onChange={(e) => f('categoryId', e.target.value)}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <ImageUpload
              label="Ảnh đại diện sản phẩm"
              value={form.thumbnail}
              onChange={(url) => f('thumbnail', url)}
            />

            {/* ===== ẢNH CHI TIẾT SẢN PHẨM ===== */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Images size={18} className="text-primary-600" />
                  <h3 className="text-sm font-bold text-gray-800">Ảnh chi tiết sản phẩm</h3>
                  {form.images.length > 0 && (
                    <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {form.images.length} ảnh
                    </span>
                  )}
                </div>
                {form.images.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { if (confirm('Xóa tất cả ảnh chi tiết?')) f('images', []); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Grid ảnh đã upload */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {form.images.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                    >
                      <img
                        src={url}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Overlay với số thứ tự */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        #{idx + 1}
                      </span>
                      {/* Nút xóa */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProductImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Zone upload thêm ảnh */}
              <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${uploadingImages
                ? 'border-primary-300 bg-primary-50 opacity-70 pointer-events-none'
                : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50'
                }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { if (e.target.files) handleUploadProductImages(e.target.files); }}
                />
                {uploadingImages ? (
                  <>
                    <Loader2 size={22} className="animate-spin text-primary-600" />
                    <span className="text-xs text-primary-600 font-medium">Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-primary-600">
                      <Plus size={16} />
                      <UploadCloud size={20} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {form.images.length === 0 ? 'Thêm ảnh chi tiết' : 'Thêm thêm ảnh'}
                    </span>
                    <span className="text-[10px] text-gray-400">Chọn nhiều ảnh cùng lúc • JPG, PNG, WEBP</span>
                  </>
                )}
              </label>

              <p className="mt-2 text-[11px] text-gray-400 italic">
                💡 Ảnh chi tiết hiển thị trong gallery trang sản phẩm. Ảnh đầu tiên sẽ xuất hiện ngay sau ảnh đại diện.
              </p>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => f('isFeatured', e.target.checked)} />
                Sản phẩm nổi bật
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)} />
                Hiển thị
              </label>
            </div>
            {/* Thông số kỹ thuật */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Thông số kỹ thuật</h2>
                <button
                  type="button"
                  onClick={() => f('additionalInfo', [...form.additionalInfo, { name: '', value: '', sortOrder: form.additionalInfo.length }])}
                  className="text-sm text-primary-700 font-medium hover:underline"
                >
                  + Thêm thông số
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {form.additionalInfo.map((info, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <input
                      placeholder="Tên (VD: Trọng lượng)"
                      className="input-field flex-1"
                      value={info.name}
                      onChange={(e) => {
                        const newInfo = [...form.additionalInfo];
                        newInfo[index].name = e.target.value;
                        f('additionalInfo', newInfo);
                      }}
                    />
                    <input
                      placeholder="Giá trị (VD: 15kg)"
                      className="input-field flex-[2]"
                      value={info.value}
                      onChange={(e) => {
                        const newInfo = [...form.additionalInfo];
                        newInfo[index].value = e.target.value;
                        f('additionalInfo', newInfo);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => f('additionalInfo', form.additionalInfo.filter((_, i) => i !== index))}
                      className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {form.additionalInfo.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Chưa có thông số nào</p>
                )}
              </div>
            </div>
          </div>


          {/* Dữ liệu 3D & 360° */}
          <div className="border-t border-gray-100 pt-6 w-1/2 flex flex-col gap-5">
            <ImageUpload
              label="Ảnh bìa 3D (Poster)"
              value={model3D.poster}
              onChange={(url) => fm('poster', url)}
            />
            <div className="flex items-center gap-2 mb-4">
              <Box className="text-primary-600" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Dữ liệu 3D & 360° (Tùy chọn)</h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setModel3DOption('upload_glb')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-bold rounded-lg transition-all ${model3DOption === 'upload_glb' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <UploadCloud size={16} />
                  File GLB
                </button>
                <button
                  type="button"
                  onClick={() => setModel3DOption('generate')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-bold rounded-lg transition-all ${model3DOption === 'generate' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Sparkles size={16} />
                  AI Tạo 3D
                </button>
                <button
                  type="button"
                  onClick={() => setModel3DOption('images_360')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-bold rounded-lg transition-all ${model3DOption === 'images_360' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <RotateCcw size={16} />
                  Nhiều ảnh
                </button>
              </div>

              {model3DOption === 'upload_glb' && (
                <>
                  <div className="text-sm text-gray-500 mb-2">Chú ý: Upload file glb để tạo mô hình 3d</div>
                  <FileUpload
                    label="Mô hình 3D (.glb)"
                    value={model3D.modelUrl}
                    onChange={(url) => fm('modelUrl', url)}
                    placeholder="Kéo thả tệp .glb vào đây..."
                    accept=".glb"
                  />
                </>
              )}

              {model3DOption === 'generate' && (
                <div className="flex flex-col gap-4 relative">
                  {/* Overlay khi đang tạo */}
                  <AnimatePresence>
                    {generating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center border-2 border-[#2b59ff]/20 shadow-xl"
                      >
                        {/* Visual Animation */}
                        <div className="relative mb-8">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-[#2b59ff] to-[#bb2bff] blur-3xl rounded-full"
                          />
                          <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-gray-100">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles size={40} className="text-[#2b59ff]" />
                            </motion.div>
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute -top-2 -right-2 bg-[#2b59ff] text-white p-1.5 rounded-full shadow-lg"
                            >
                              <Loader2 size={14} className="animate-spin" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Status & Progress */}
                        <div className="w-full max-w-xs space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-gray-800">Đang tạo mô hình 3D</h3>
                            <div className="h-7 overflow-hidden">
                              <AnimatePresence mode="wait">
                                <motion.p
                                  key={genMessageIndex}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -20, opacity: 0 }}
                                  className="text-sm font-medium text-[#2b59ff]"
                                >
                                  {GEN_MESSAGES[genMessageIndex]}
                                </motion.p>
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                              <motion.div
                                className="h-full bg-gradient-to-r from-[#2b59ff] to-[#bb2bff]"
                                initial={{ width: 0 }}
                                animate={{ width: `${genProgress}%` }}
                                transition={{ type: "spring", damping: 20, stiffness: 50 }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                              <span>Tiến độ: ~{Math.round(genProgress)}%</span>
                              <span>Đã trôi qua: {Math.floor(genTimer / 60)}:{String(genTimer % 60).padStart(2, '0')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tips */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="mt-8 bg-[#2b59ff]/5 border border-[#2b59ff]/10 rounded-xl p-3 max-w-xs"
                        >
                          <p className="text-[11px] text-[#2b59ff]/80 italic">
                            💡 Mẹo: Bạn có thể tiếp tục chỉnh sửa các thông tin khác của sản phẩm phía bên trái trong khi chờ đợi.
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-sm text-gray-500">
                    Upload 1–4 ảnh từ các hướng khác nhau. Ảnh càng nhiều mô hình 3D càng chính xác.
                    Thời gian xử lý: ~2–5 phút.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {SLOTS.map(({ key, label, required }) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-gray-600">
                          {label} {required && <span className="text-red-500">*</span>}
                        </span>
                        {genViews[key] ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#2b59ff]">
                            <img src={genViews[key]} className="w-full h-full object-cover" alt={label} />
                            <button
                              type="button"
                              onClick={() => setGenViews(prev => ({ ...prev, [key]: '' }))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#2b59ff] hover:bg-blue-50 transition-all">
                            <UploadCloud size={20} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400">Chọn ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadViewImage(key, file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate3D}
                    disabled={generating || !genViews.front}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#2b59ff] to-[#bb2bff] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>{genStatus}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Tạo 3D AI ({Object.values(genViews).filter(Boolean).length} ảnh)
                      </>
                    )}
                  </button>
                  {genModelId && !generating && !model3D.modelUrl && (
                    <button
                      type="button"
                      onClick={async () => {
                        await ProductsService.postProducts3DRetry(genModelId);
                        handleGenerate3D();
                      }}
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-[#2b59ff] border border-[#2b59ff] hover:bg-blue-50 transition-all"
                    >
                      <RotateCcw size={16} />
                      Thử lại
                    </button>
                  )}
                </div>
              )}

              {model3DOption === 'images_360' && (
                <div className="flex flex-col gap-4">
                  <MultiImageUpload
                    value={model3D.images360}
                    onChange={(urls) => fm('images360', urls)}
                  />
                  <p className="text-xs text-gray-500 italic">Tải lên chuỗi ảnh chụp từ mọi hướng để tạo hiệu ứng xoay sản phẩm.</p>
                </div>
              )}

              {((model3DOption !== 'images_360' && model3D.modelUrl) || (model3DOption === 'images_360' && model3D.images360.length > 0)) && (
                <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Xem trước kết quả</span>
                  </div>
                  <div className="aspect-square bg-zinc-50">
                    {model3DOption === 'images_360' ? (
                      <ProductImage360 images360={model3D.images360} />
                    ) : (
                      <ProductModelViewer
                        modelUrl={model3D.modelUrl}
                        poster={model3D.poster}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/2 ml-auto">
          <div className="flex gap-3 justify-center max-w-md ml-auto">
            <button type="submit" disabled={loading}
              className="btn-primary bg-primary-700 hover:bg-primary-800 focus:ring-primary-500/50 flex-1">
              {loading ? 'Đang lưu...' : isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
            </button>
            <button type="button" onClick={() => router.push('/admin/products')}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
