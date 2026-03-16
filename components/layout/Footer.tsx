import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer({ config }: { config?: Record<string, string> }) {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-primary-700 rounded flex items-center justify-center text-white font-bold text-lg">V</div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">VITECHS., JSC</p>
              <p className="text-gray-400 text-xs">Công ty CP ĐT TM & DV Công nghệ Việt</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Chuyên cung cấp thiết bị đào tạo, giáo cụ trực quan và dịch vụ dạy nghề chuyên nghiệp.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Liên kết nhanh</h4>
          <ul className="flex flex-col gap-2 text-sm">
            {[
              { label: 'Trang chủ', href: '/' },
              { label: 'Sản phẩm', href: '/san-pham' },
              { label: 'Tin tức', href: '/tin-tuc' },
              { label: 'Liên hệ', href: '/lien-he' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Thông tin liên hệ</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-primary-500 shrink-0" />
              {config?.contact_address || 'Số 04 ngõ 151 - Hoàng Hoa Thám - Ngọc Hà - Ba Đình - Hà Nội'}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-primary-500 shrink-0" />
              {config?.contact_phone || '024.6682.8899'}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-primary-500 shrink-0" />
              {config?.contact_email || 'vitechs.jsc@gmail.com'}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="text-primary-500 shrink-0" />
              {config?.contact_hours || 'Từ 8h–20h hàng ngày'}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        Copyright {new Date().getFullYear()} © Vitechs., JSC — All rights reserved.
      </div>
    </footer>
  );
}
