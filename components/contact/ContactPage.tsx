import ContactForm from './ContactForm';
import { CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B3B24] mb-8 uppercase tracking-wide">
          HỢP TÁC CÙNG VITECHS
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-between items-start md:items-center">
          <p className="text-gray-700 text-[15px] font-medium max-w-lg leading-relaxed">
            Nâng tầm doanh nghiệp của bạn với các giải pháp công nghệ giáo dục và thiết bị đào tạo tiên tiến. Hãy để Vitechs đồng hành cùng bạn trên con đường chinh phục thành công.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#00D1B2] shrink-0" size={20} />
              <span className="text-[14px] font-bold text-gray-800">Nhận bản demo miễn phí giải pháp của Vitechs.</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#00D1B2] shrink-0" size={20} />
              <span className="text-[14px] font-bold text-gray-800">Được tư vấn miễn phí từ các chuyên gia trong ngành.</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#00D1B2] shrink-0" size={20} />
              <span className="text-[14px] font-bold text-gray-800">Truy cập tài nguyên miễn phí về ứng dụng thiết bị.</span>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full flex flex-col lg:flex-row items-stretch min-h-[520px] border-t border-gray-100">
        <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center min-h-[380px] lg:min-h-auto flex-shrink-0">
          {/* Khu vực hình ảnh */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg w-[90%] h-[80%] min-h-[300px] flex items-center justify-center text-gray-400 text-sm">
            Khu vực hiển thị hình ảnh
          </div>
        </div>

        <div className="lg:w-1/2 px-8 md:px-16 py-12">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
