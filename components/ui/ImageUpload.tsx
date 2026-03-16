'use client';

import { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2, Link2, ImageOff } from 'lucide-react';
import { getToken } from '@/services/adminService';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Ảnh đại diện' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [preview, setPreview] = useState('');
  const [imgError, setImgError] = useState(false);

  // Reset lỗi ảnh khi value thay đổi
  useEffect(() => {
    setImgError(false);
  }, [value, preview]);

  const handleFile = async (file: File) => {
    if (!file) return;
    setError('');
    // Hiện preview ngay lập tức bằng blob URL
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: fd,
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Upload thất bại');
      onChange(data.url);          // URL thực từ server
      setPreview('');              // bỏ blob, dùng URL server
      URL.revokeObjectURL(blobUrl);
    } catch (e: unknown) {
      setError((e as Error).message || 'Upload thất bại');
      setPreview('');
      URL.revokeObjectURL(blobUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setPreview('');
    setShowUrlInput(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayImg = preview || value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

      {/* Nếu đã có ảnh → hiện preview + nút đổi */}
      {displayImg ? (
        <div className="flex items-start gap-4">
          <div className="relative">
            {imgError ? (
              <div className="h-36 w-36 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 gap-1">
                <ImageOff size={28} />
                <span className="text-xs text-center px-2">Không tải được ảnh</span>
              </div>
            ) : (
              <img
                src={displayImg}
                alt="preview"
                className="h-36 w-36 object-cover rounded-xl border border-gray-200 shadow-sm"
                onError={() => setImgError(true)}
              />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-primary-700" />
              </div>
            )}
            <button
              type="button" onClick={handleClear}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow transition">
              <X size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition flex items-center gap-1.5">
              <Upload size={13} /> Đổi ảnh khác
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(v => !v)}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition flex items-center gap-1.5">
              <Link2 size={13} /> Nhập URL
            </button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        /* Chưa có ảnh → vùng kéo thả */
        <div>
          <div
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onDragOver={e => e.preventDefault()}
            onClick={() => !uploading && inputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition border-gray-200 hover:border-primary-400 hover:bg-primary-50">
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <Upload size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-600">Kéo thả hoặc <span className="text-primary-700 underline">click để chọn</span></p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF – tối đa 5MB</p>
          </div>
          <button
            type="button"
            onClick={() => setShowUrlInput(v => !v)}
            className="mt-2 text-xs text-gray-500 hover:text-primary-700 flex items-center gap-1 transition">
            <Link2 size={13} /> {showUrlInput ? 'Ẩn nhập URL' : 'Hoặc nhập URL ảnh'}
          </button>
        </div>
      )}

      {/* URL input (toggle) — chỉ hiện khi bấm nút "Nhập URL" */}
      {showUrlInput && (
        <div className="mt-2 flex gap-2 items-center">
          <Link2 size={14} className="text-gray-400 shrink-0" />
          <input
            type="url" value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Hoặc dán URL ảnh vào đây..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary-400 transition"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1.5">⚠ {error}</p>}
    </div>
  );
}
