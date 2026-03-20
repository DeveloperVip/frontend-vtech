'use client';

import { useState } from 'react';
import { Facebook, Link2, Check, Linkedin } from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent
    }
  };

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Chia sẻ:</span>

      <a
        href={fbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2] text-white text-xs font-semibold hover:opacity-90 transition"
      >
        <Facebook size={13} />
        Facebook
      </a>

      <a
        href={liUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-semibold hover:opacity-90 transition"
      >
        <Linkedin size={13} />
        LinkedIn
      </a>

      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
          copied
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-700'
        }`}
      >
        {copied ? <Check size={13} /> : <Link2 size={13} />}
        {copied ? 'Đã sao chép!' : 'Sao chép link'}
      </button>
    </div>
  );
}
