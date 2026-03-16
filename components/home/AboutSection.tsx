import { BookOpen, Wrench, Users } from 'lucide-react';

const items = [
  {
    icon: <BookOpen size={28} />,
    title: 'Mô hình dạy học',
    desc: 'Phát triển các sản phẩm giáo cụ trực quan, hỗ trợ giảng viên trình bày phương pháp thực hành cho các ngành Cơ khí, Điện, Điện tử, Ô tô…',
  },
  {
    icon: <Wrench size={28} />,
    title: 'Dịch vụ',
    desc: 'Mở các lớp đào tạo nghề ngắn hạn, đảm bảo đầu ra chuẩn. Cung cấp dịch vụ bảo dưỡng, sửa chữa thiết bị, máy công trình, dây chuyền công nghiệp.',
  },
  {
    icon: <Users size={28} />,
    title: 'Nhân sự',
    desc: 'Đội ngũ kỹ sư cơ khí hơn 10 năm kinh nghiệm. Giảng viên từ Thạc sĩ đến Phó Giáo sư, kỹ thuật viên cao cấp từ Toyota, Ford, Vietnam Airlines.',
  },
];

export default function AboutSection({ config }: { config?: Record<string, string> }) {
  return (
    <section id="gioi-thieu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Giới thiệu về Vitechs</h2>
          <div className="w-16 h-1 bg-primary-700 mx-auto rounded" />
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            {config?.about_content ||
              'VITECHS., JSC được thành lập năm 2009 tại Hà Nội với mong muốn phát triển các sản phẩm giáo cụ trực quan, sản phẩm dạy nghề hỗ trợ các giảng viên và học sinh sinh viên.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.title}
              className="p-6 border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
