'use client';

import { useRef, useState, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Crop as CropIcon, RotateCcw, Check, Image as ImageIcon, FileImage } from 'lucide-react';

interface ImageCropModalProps {
  src: string;
  onCrop: (croppedBlob: Blob) => void;
  onClose: () => void;
}

interface ImageInfo {
  originalW: number;
  originalH: number;
  originalSize: number | null; // bytes, null if blob URL (unknown)
}

function centerAspectCrop(width: number, height: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect, width, height),
    width,
    height
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const ASPECT_OPTIONS = [
  { label: 'Tự do', value: undefined },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:4', value: 3 / 4 },
];

export default function ImageCropModal({ src, onCrop, onClose }: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [loading, setLoading] = useState(false);
  const [imgInfo, setImgInfo] = useState<ImageInfo | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight, width, height } = e.currentTarget;
    setImgInfo({ originalW: naturalWidth, originalH: naturalHeight, originalSize: null });

    // Try to get file size from blob URL via fetch
    fetch(src)
      .then(r => r.blob())
      .then(b => setImgInfo(prev => prev ? { ...prev, originalSize: b.size } : null))
      .catch(() => {});

    const initialCrop = centerAspectCrop(width, height, aspect ?? 1);
    setCrop(initialCrop);
  }, [aspect, src]);

  const handleCropChange = useCallback((c: PixelCrop) => {
    setCompletedCrop(c);
    if (!imgRef.current) return;
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const outW = Math.round(c.width * scaleX);
    const outH = Math.round(c.height * scaleY);
    // Rough estimate: WebP ~0.2 bits per pixel
    const est = Math.round((outW * outH * 0.2) / 8);
    setEstimatedSize(est);
  }, []);

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    } else if (!newAspect) {
      setCrop(undefined);
    }
  };

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    setLoading(true);

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob(
      (blob) => {
        if (blob) onCrop(blob);
        setLoading(false);
      },
      'image/webp',
      0.92,
    );
  };

  // Computed crop dimensions in natural pixels
  const cropW = imgRef.current && completedCrop
    ? Math.round(completedCrop.width * (imgRef.current.naturalWidth / imgRef.current.width))
    : null;
  const cropH = imgRef.current && completedCrop
    ? Math.round(completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CropIcon size={20} className="text-primary-600" />
            <h2 className="text-base font-bold text-gray-800">Chỉnh sửa & Cắt ảnh</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 mr-1">Tỉ lệ:</span>
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleAspectChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                aspect === opt.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-900 min-h-[280px]">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => handleCropChange(c)}
            aspect={aspect}
            className="max-h-[48vh]"
          >
            <img
              ref={imgRef}
              src={src}
              alt="crop-source"
              onLoad={onImageLoad}
              className="max-h-[48vh] max-w-full object-contain"
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>

        {/* Image Info Bar */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50 text-xs">
          {/* Original info */}
          <div className="px-5 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-200/80 flex items-center justify-center shrink-0">
              <ImageIcon size={14} className="text-gray-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Ảnh gốc</p>
              <p className="font-bold text-gray-800">
                {imgInfo ? `${imgInfo.originalW} × ${imgInfo.originalH} px` : '—'}
              </p>
              {imgInfo?.originalSize != null && (
                <p className="text-gray-400 mt-0.5">{formatBytes(imgInfo.originalSize)}</p>
              )}
            </div>
          </div>

          {/* Crop result info */}
          <div className="px-5 py-3 flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${cropW ? 'bg-primary-100' : 'bg-gray-200/80'}`}>
              <FileImage size={14} className={cropW ? 'text-primary-600' : 'text-gray-400'} />
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase tracking-wide text-[10px] mb-0.5">Sau khi cắt</p>
              {cropW && cropH ? (
                <>
                  <p className="font-bold text-primary-700">{cropW} × {cropH} px</p>
                  {estimatedSize != null && (
                    <p className="text-gray-400 mt-0.5">
                      ~{formatBytes(estimatedSize)}
                      <span className="ml-1 text-gray-300">(ước tính WebP)</span>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-400 italic">Kéo để chọn vùng cắt</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={() => {
              if (imgRef.current) {
                const { width, height } = imgRef.current;
                setCrop(centerAspectCrop(width, height, aspect ?? 1));
              }
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <RotateCcw size={16} />
            Đặt lại
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleCrop}
              disabled={!completedCrop || loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={16} />
              )}
              Áp dụng cắt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
