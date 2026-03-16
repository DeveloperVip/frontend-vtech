import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ config }: { config?: Record<string, string> }) {
  return (
    <section className="relative min-h-[540px] flex items-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Thành lập 2009 · Hà Nội
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {config?.hero_title || 'VITECHS., JSC'}
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-lg">
            {config?.hero_subtitle || 'Thiết bị đào tạo – Giáo cụ trực quan – Dạy nghề chuyên nghiệp'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/san-pham"
              className="flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Xem sản phẩm <ArrowRight size={16} />
            </Link>
            <Link href="/lien-he"
              className="flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
              Liên hệ ngay
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { number: '15+', label: 'Năm kinh nghiệm' },
            { number: '500+', label: 'Sản phẩm' },
            { number: '1000+', label: 'Khách hàng' },
            { number: '50+', label: 'Đối tác' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-3xl font-bold">{s.number}</p>
              <p className="text-primary-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
