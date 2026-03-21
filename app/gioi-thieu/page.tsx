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
            <div className="max-w-4xl mx-auto space-y-8 text-[#666] leading-[1.8] mb-16 text-center text-[15px]">
              <p>
                CTCP ĐẦU TƯ THƯƠNG MẠI VÀ DỊCH VỤ CÔNG NGHỆ VIỆT – VITECHS.,JSC – là nhà cung cấp các thiết bị phục vụ thí nghiệm, đào tạo và dạy nghề có uy tín tại Việt Nam. Công ty chúng tôi là một doanh nghiệp chuyên đi sâu vào việc: Sản xuất các sản phẩm cơ khí, điện, điện tử; sản xuất, lắp ráp các mô hình học cụ phục vụ dạy nghề Điện công nghiệp – Tự động hóa, Cơ khí, Ô tô, Điện lạnh.
              </p>
              <p>
                Ngoài ra chúng tôi còn là nhà nhập khẩu mua bán thương mại các linh kiện phụ kiện, phụ tùng, máy móc, dụng cụ, thiết bị, thiết bị thí nghiệm, thiết bị đo kiểm trong ngành cơ khí, điện, điện tử - tự động hóa, ô tô, máy xây dựng, máy cơ khí, máy phát điện.
              </p>
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
      </main>
      <Footer config={config} />
    </>
  );
}
