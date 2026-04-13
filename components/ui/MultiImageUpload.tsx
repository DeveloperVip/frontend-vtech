'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2, Plus, Image as ImageIcon } from 'lucide-react';
import { getToken } from '@/services/adminService';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUpload({
  value = [],
  onChange,
  label = 'Ảnh 360° (Dạng xoay)',
  maxImages = 72
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setError('');

    // Giới hạn số lượng
    if (value.length + files.length > maxImages) {
      setError(`Vượt quá số lượng tối đa ${maxImages} ảnh.`);
      return;
    }

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
        if (data.success) {
          newUrls.push(data.url);
        } else {
          console.error('Lỗi upload 1 file:', data.message);
        }
      }
      onChange([...value, ...newUrls]);
    } catch (e: unknown) {
      setError((e as Error).message || 'Có lỗi khi upload một số file.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newVal = [...value];
    newVal.splice(index, 1);
    onChange(newVal);
  };

  const clearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả ảnh?')) {
      onChange([]);
    }
  };

  return (
    <div>
      <div className='text-sm text-gray-500 mb-2'>Chú ý: Tự tùy chỉnh ảnh 3d bằng cách chụp 1 vòng sản phẩm để tạo thành dạng ảnh có hiệu ứng chuyển động giống file glb</div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {value.length > 0 && (
          <button
            type="button" onClick={clearAll}
            className="text-xs text-red-500 hover:underline">
            Xóa tất cả ({value.length})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Render existing images */}
        {value.map((url, index) => (
          <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
            <img src={url} alt={`360-${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <X size={12} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 py-0.5 bg-black/30 text-[10px] text-white text-center">
              #{index + 1}
            </div>
          </div>
        ))}

        {/* Add more button */}
        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => !uploading && inputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:bg-primary-50 transition shrink-0"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-primary-700" size={24} />
            ) : (
              <>
                <Plus size={24} />
                <span className="text-[10px] mt-1">Thêm ảnh</span>
              </>
            )}
            <input
              ref={inputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => { if (e.target.files) handleFiles(e.target.files); }}
            />
          </button>
        )}
      </div>

      {value.length === 0 && !uploading && (
        <p className="text-xs text-gray-400 mt-1 italic">Chưa có ảnh 360 nào. Vui lòng thêm chuỗi ảnh để tạo hiệu ứng xoay.</p>
      )}

      {error && <p className="text-red-500 text-xs mt-1.5">⚠ {error}</p>}
    </div>
  );
}
