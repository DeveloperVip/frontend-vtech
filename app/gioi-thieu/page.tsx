import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import { Target, Eye, Award, Users } from 'lucide-react';
import AnimatedHeader from '@/components/layout/AnimatedHeader';

export const revalidate = 60;

export const metadata = {
  title: 'Giới thiệu – Vitechs',
  description: 'Tìm hiểu về Vitechs – đơn vị cung cấp thiết bị kỹ thuật chuyên nghiệp.',
};

export default async function GioiThieuLocalePage() {
  const config = siteConfig;

  const stats = [
    { label: 'Năm kinh nghiệm', value: config.stat_years || '10+' },
    { label: 'Dự án hoàn thành', value: config.stat_projects || '500+' },
    { label: 'Khách hàng tin dùng', value: config.stat_clients || '200+' },
    { label: 'Tỉnh thành phủ sóng', value: config.stat_provinces || '20+' },
  ];

  return (
    <>
      <main>
        <AnimatedHeader title="Giới thiệu" subtitle="Về chúng tôi – Vitechs" />
        <section className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
              {config.site_name || 'Vitechs'} – Giải pháp kỹ thuật hàng đầu
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              <p>
                {config.about_description ||
                  'Vitechs là đơn vị chuyên cung cấp thiết bị kỹ thuật, dịch vụ sửa chữa và bảo trì máy móc công nghiệp trong lĩnh vực ô tô, điện lạnh và điện công nghiệp. Với đội ngũ kỹ thuật viên giàu kinh nghiệm và hệ thống thiết bị hiện đại, chúng tôi cam kết mang lại giải pháp tối ưu cho khách hàng.'}
              </p>
            </div>
          </div>
          {config.about_image ? (
            <img src={config.about_image} alt="Về Vitechs" className="rounded-2xl w-full object-cover shadow-md" />
          ) : (
            <div className="rounded-2xl w-full aspect-[4/3] bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
              <span className="text-white text-6xl font-extrabold opacity-20">V</span>
            </div>
          )}
        </section>

        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-3xl font-extrabold text-primary-700">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">Sứ mệnh & Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, color: 'text-primary-700', bg: 'bg-primary-50', title: 'Sứ mệnh', desc: config.mission || 'Cung cấp thiết bị và dịch vụ kỹ thuật chất lượng cao, giúp tối ưu hóa hiệu suất cho khách hàng.' },
              { icon: Eye, color: 'text-blue-700', bg: 'bg-blue-50', title: 'Tầm nhìn', desc: config.vision || 'Trở thành đối tác kỹ thuật tin cậy hàng đầu trong khu vực, không ngừng đổi mới và phát triển.' },
              { icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Chất lượng', desc: 'Cam kết cung cấp sản phẩm và dịch vụ đạt chuẩn chất lượng quốc tế, bảo đảm sự hài lòng của khách hàng.' },
              { icon: Users, color: 'text-green-700', bg: 'bg-green-50', title: 'Đội ngũ', desc: 'Kỹ thuật viên được đào tạo bài bản, giàu kinh nghiệm thực tiễn, luôn tận tâm với công việc.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon size={24} className={item.color} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer config={config} />
    </>
  );
}
