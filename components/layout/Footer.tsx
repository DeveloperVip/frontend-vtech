import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer({ config }: { config?: Record<string, string> }) {
  return (
<<<<<<< HEAD
    <footer className="bg-gradient-to-b from-[#f8faff] to-[#eef3fd] text-gray-600 pt-16 pb-8 border-t border-[#d5e2fa]">
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
              <p className="text-[#2563EB] font-medium text-[11px] uppercase tracking-wider mt-1">Công ty CP ĐT TM & DV <br className="hidden lg:block"/>Công nghệ Việt</p>
            </div>
          </div>
          <p className="text-[14px] text-gray-500 leading-relaxed pr-6">
            Chuyên cung cấp thiết bị đào tạo, giáo cụ trực quan và dịch vụ dạy nghề chuyên nghiệp, đồng hành cùng sự phát triển giáo dục Việt Nam.
=======
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
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
          </p>
        </div>

        {/* Links */}
        <div>
<<<<<<< HEAD
          <h4 className="text-[#0B1527] font-bold text-[16px] mb-5 tracking-wide">Liên kết nhanh</h4>
          <ul className="flex flex-col gap-3 text-[14px]">
=======
          <h4 className="text-white font-semibold mb-3">Liên kết nhanh</h4>
          <ul className="flex flex-col gap-2 text-sm">
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
            {[
              { label: 'Trang chủ', href: '/' },
              { label: 'Sản phẩm', href: '/san-pham' },
              { label: 'Tin tức', href: '/tin-tuc' },
              { label: 'Liên hệ', href: '/lien-he' },
            ].map((l) => (
              <li key={l.href}>
<<<<<<< HEAD
                <Link href={l.href} className="text-gray-500 hover:text-[#2563EB] hover:translate-x-1 inline-block transition-all duration-300 font-medium">{l.label}</Link>
=======
                <Link href={l.href} className="hover:text-white transition">{l.label}</Link>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
<<<<<<< HEAD
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
=======
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
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
            </li>
          </ul>
        </div>
      </div>

<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-[#d5e2fa] flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-gray-500 font-medium">
          Copyright {new Date().getFullYear()} © Vitechs., JSC — All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-[13px] text-gray-500">
          <Link href="#" className="hover:text-[#2563EB] transition-colors">Điều khoản dịch vụ</Link>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <Link href="#" className="hover:text-[#2563EB] transition-colors">Chính sách bảo mật</Link>
        </div>
=======
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        Copyright {new Date().getFullYear()} © Vitechs., JSC — All rights reserved.
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
      </div>
    </footer>
  );
}
