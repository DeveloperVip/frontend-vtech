import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer({ config }: { config?: Record<string, string> }) {
  return (
    <footer 
      className="text-gray-600 pt-16 pb-8 border-t border-[#d5e2fa]"
      style={{ 
        background: 'linear-gradient(90deg,rgba(232, 232, 232, 1) 0%, rgba(204, 217, 237, 1) 0%)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img
              src="/vitechs.png"
              alt="VITECHS Logo"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
            <div>
              <p className="font-extrabold text-[#0B1527] text-[17px] leading-tight tracking-[0.02em]">VITECHS., JSC</p>
              <p className="text-[#2563EB] font-medium text-[11px] uppercase tracking-wider mt-1">Công ty CP ĐT TM & DV <br className="hidden lg:block" />Công nghệ Việt</p>
            </div>
          </div>
          <p className="text-[14px] text-gray-500 leading-relaxed pr-6">
            Chuyên cung cấp thiết bị đào tạo, giáo cụ trực quan và dịch vụ dạy nghề chuyên nghiệp, đồng hành cùng sự phát triển giáo dục Việt Nam.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-[#0B1527] font-bold text-[16px] mb-5 tracking-wide">Liên kết nhanh</h4>
          <ul className="flex flex-col gap-3 text-[14px]">
            {[
              { label: 'Trang chủ', href: '/' },
              { label: 'Sản phẩm', href: '/san-pham' },
              { label: 'Tin tức', href: '/tin-tuc' },
              { label: 'Liên hệ', href: '/lien-he' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-gray-500 hover:text-[#2563EB] hover:translate-x-1 inline-block transition-all duration-300 font-medium">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#0B1527] font-bold text-[16px] mb-5 tracking-wide">Thông tin liên hệ</h4>
          <ul className="flex flex-col gap-4 text-[14px] text-gray-600">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-blue-50">
                <MapPin size={16} className="text-[#2563EB]" />
              </div>
              <span className="mt-1.5 leading-relaxed">{config?.contact_address || 'Số 04 ngõ 151 - Hoàng Hoa Thám - Ngọc Hà - Ba Đình - Hà Nội'}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-blue-50">
                <Phone size={16} className="text-[#2563EB]" />
              </div>
              <span className="font-medium text-gray-700">{config?.contact_phone || '024.6682.8899'}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-blue-50">
                <Mail size={16} className="text-[#2563EB]" />
              </div>
              <span>{config?.contact_email || 'vitechs.jsc@gmail.com'}</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-blue-50">
                <Clock size={16} className="text-[#2563EB]" />
              </div>
              <span>{config?.contact_hours || 'Từ 8h–20h hàng ngày'}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-[#d5e2fa] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-gray-500 font-medium">
          Copyright {new Date().getFullYear()} © Vitechs., JSC — All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-[13px] text-gray-500">
          <Link href="#" className="hover:text-[#2563EB] transition-colors">Điều khoản dịch vụ</Link>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <Link href="#" className="hover:text-[#2563EB] transition-colors">Chính sách bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
