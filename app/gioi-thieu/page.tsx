import siteConfig from '@/config/siteConfig';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import AboutStats from '@/components/about/AboutStats';
import AboutInfoBoxes from '@/components/about/AboutInfoBoxes';
import AboutFields from '@/components/about/AboutFields';
import AboutServices from '@/components/about/AboutServices';
import AboutTeam from '@/components/about/AboutTeam';
import AboutVision from '@/components/about/AboutVision';
import AboutOrgChart from '@/components/about/AboutOrgChart';
import AboutProductShowcase from '@/components/about/AboutProductShowcase';
import PartnersSection from '@/components/home/PartnersSection';

export const revalidate = 60;

export const metadata = {
  title: 'Giới thiệu – Vitechs',
  description: 'Tìm hiểu về Vitechs – đơn vị cung cấp thiết bị kỹ thuật chuyên nghiệp.',
};

export default async function GioiThieuPage() {
  const config = siteConfig;

  return (
    <>
      <main>
        <AboutHero config={config} />

        {/* Về Chúng Tôi */}
        <section className="py-24 bg-white">
          <div className="max-w-[1440px] mx-auto px-2 md:px-4 text-center">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 uppercase tracking-wider mb-8">Về Chúng Tôi</h2>
            </div>

            {/* Stats Highlight (Client Component for Animations) */}
            <AboutStats />

            {/* Description Text */}
            <div className="max-w-5xl mx-auto mb-16 text-[15px] text-[#64748b] leading-[1.85]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/60">
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 transition-all duration-300 group-hover:w-20" />
                  <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">Mô hình dạy học</h3>
                  <p>
                    VITECHS., JSC thành lập năm 2009 tại Hà Nội, phát triển giáo cụ trực quan và thiết bị dạy nghề, hỗ trợ giảng dạy thực hành cho các ngành Cơ khí, Điện - Điện tử, Điện công nghiệp, Điện lạnh và Ô tô.
                  </p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/60">
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 transition-all duration-300 group-hover:w-20" />
                  <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">Dịch vụ</h3>
                  <p>
                    Chúng tôi cung cấp đào tạo nghề ngắn hạn theo chuẩn kỹ năng hiện hành, đồng thời triển khai dịch vụ bảo dưỡng, sửa chữa thiết bị, máy công trình và dây chuyền công nghiệp.
                  </p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/60">
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 transition-all duration-300 group-hover:w-20" />
                  <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">Nhân sự</h3>
                  <p>
                    Đội ngũ kỹ sư và giảng viên được đào tạo bài bản, chuyên môn cao, nhiều kinh nghiệm thực tiễn trong sản xuất và đào tạo kỹ thuật.
                  </p>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/60">
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 transition-all duration-300 group-hover:w-20" />
                  <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">Mục tiêu</h3>
                  <p>
                    Giữ vững vị thế trong lĩnh vực thiết bị đào tạo - dạy nghề, cung cấp giải pháp chất lượng cao và phát triển đội ngũ nhân lực chuyên sâu để phục vụ khách hàng tốt nhất.
                  </p>
                </div>
              </div>
            </div>

            {/* Blue Banner Box */}
            <div
              className="max-w-4xl mx-auto text-white p-8 rounded-2xl text-center shadow-xl shadow-blue-500/20 mb-12 font-black text-lg leading-relaxed uppercase"
              style={{ background: 'linear-gradient(90deg, rgba(69, 133, 230, 1) 0%, rgba(54, 132, 247, 1) 100%)' }}
            >
              Qua 15 năm hoạt động, doanh nghiệp chúng tôi đã và đang khẳng định được mình trong lĩnh vực kinh doanh tại Việt Nam.
            </div>

            {/* Info Boxes (Client Component for Animations) */}
            <AboutInfoBoxes />
          </div>
        </section>

        {/* Sơ Đồ Tổ Chức (Client Component for Animations) */}
        <section className="py-24 bg-white border-t border-gray-50">
          <AboutOrgChart />
        </section>

        {/* Lĩnh Vực Hoạt Động (Client Component for Animations) */}
        <section className="py-24 bg-white border-t border-gray-50">
          <div className="max-w-[1440px] mx-auto px-2 md:px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 uppercase tracking-wider mb-8">Lĩnh Vực Hoạt Động</h2>
              <p className="text-[#666] font-medium italic text-[15px]">Chúng tôi cung cấp đa dạng các sản phẩm và dịch vụ chất lượng cao</p>
            </div>

            <AboutFields />
          </div>
        </section>

        {/* Dịch vụ chất lượng cao (Client Component for Animations) */}
        <section className="py-24 bg-white border-t border-gray-50">
          <div className="max-w-[1440px] mx-auto px-2 md:px-4">
            <AboutServices />
          </div>
        </section>

        {/* Đội Ngũ Nhân Sự (Client Component for Animations) */}
        <section className="py-24 bg-white border-t border-gray-50">
          <AboutTeam />
        </section>

        {/* Tầm Nhìn & Sứ Mệnh (Client Component for Animations) */}
        <section className="py-24 bg-white border-t border-gray-50">
          <div className="max-w-[1440px] mx-auto px-2 md:px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-4">Tầm Nhìn & Sứ Mệnh</h2>
              <div className="w-16 h-1 bg-blue-600 mx-auto mb-8 rounded-full" />
              <p className="text-[#64748b] font-medium text-[15px]">Định hướng phát triển và cam kết của chúng tôi</p>
            </div>

            <AboutVision config={config} />
          </div>
        </section>


        {/* Đối tác (Client Component for Animations) */}
        <PartnersSection />
        {/* Sản phẩm tiêu biểu theo lĩnh vực (Client Component for Tabs + Slider) */}
        <AboutProductShowcase />
      </main>
      <Footer config={config} />
    </>
  );
}
