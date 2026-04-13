'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2, FileBox, FileArchive } from 'lucide-react';
import { getToken } from '@/services/adminService';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  placeholder?: string;
}

export default function FileUpload({
  value,
  onChange,
  label = 'Tệp 3D (.glb, .gltf)',
  accept = '.glb,.gltf,.zip',
  placeholder = 'Kéo thả file 3D vào đây...'
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    console.log(file)
    if (!file) return;
    setError('');
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
      onChange(data.url);
    } catch (e: unknown) {
      setError((e as Error).message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const getFileName = (url: string) => {
    try {
      const parts = url.split('/');
      return parts[parts.length - 1];
    } catch {
      return url;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

      {value ? (
        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center shrink-0">
            <FileBox size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{getFileName(value)}</p>
            <p className="text-xs text-gray-500 truncate">{value}</p>
          </div>
          <button
            type="button" onClick={handleClear}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition border-gray-200 hover:border-primary-400 hover:bg-primary-50">
          <input ref={inputRef} type="file" accept={accept} className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {uploading ? (
            <Loader2 size={24} className="mx-auto text-primary-700 animate-spin mb-2" />
          ) : (
            <Upload size={24} className="mx-auto text-gray-300 mb-2" />
          )}
          <p className="text-sm font-medium text-gray-600">{uploading ? 'Đang tải lên...' : placeholder}</p>
          <p className="text-xs text-gray-400 mt-1">{accept.replace(/\./g, ' ').toUpperCase()}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1.5">⚠ {error}</p>}
    </div>
  );
}
