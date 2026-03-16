/**
 * Cấu hình website fix cứng – chỉnh sửa trực tiếp tại đây
 * Màu chủ đạo: #164DBC (primary-700 trong tailwind.config.js)
 */
const siteConfig = {
  // ── Thông tin chung ────────────────────────────────────────────
  site_name:    'Vitechs',
  site_tagline: 'Giải pháp kỹ thuật hàng đầu',
  logo_url:     '',
  favicon_url:  '',

  // ── Liên hệ ───────────────────────────────────────────────────
  contact_phone:     '024.6682.8899',
  contact_email:     'vitechs.jsc@gmail.com',
  contact_address:   'Số 1, đường Giải Phóng, Hà Nội',
  contact_map_embed: '',

  // ── Mạng xã hội ───────────────────────────────────────────────
  social_facebook: 'https://facebook.com/vitechs',
  social_youtube:  '',
  social_zalo:     '0246682889',

  // ── Banner trang chủ ──────────────────────────────────────────
  hero_title:    'Giải pháp kỹ thuật chuyên nghiệp',
  hero_subtitle: 'Chuyên cung cấp thiết bị và dịch vụ kỹ thuật cho ngành ô tô, điện lạnh và điện công nghiệp.',
  hero_image:    '',
  hero_cta_text: 'Xem sản phẩm',
  hero_cta_link: '/san-pham',

  // ── Giới thiệu ────────────────────────────────────────────────
  about_description: 'Vitechs là đơn vị chuyên cung cấp thiết bị kỹ thuật, dịch vụ sửa chữa và bảo trì máy móc công nghiệp trong lĩnh vực ô tô, điện lạnh và điện công nghiệp.',
  about_image:       '',
  mission:           'Cung cấp thiết bị và dịch vụ kỹ thuật chất lượng cao, giúp tối ưu hóa hiệu suất cho khách hàng.',
  vision:            'Trở thành đối tác kỹ thuật tin cậy hàng đầu trong khu vực, không ngừng đổi mới và phát triển.',
  stat_years:        '10+',
  stat_projects:     '500+',
  stat_clients:      '200+',
  stat_provinces:    '20+',

  // ── SEO ───────────────────────────────────────────────────────
  meta_title:       'Vitechs – Thiết bị kỹ thuật chuyên nghiệp',
  meta_description: 'Vitechs cung cấp thiết bị và dịch vụ kỹ thuật cho ngành ô tô, điện lạnh, điện công nghiệp.',
  meta_keywords:    'vitechs, thiết bị kỹ thuật, ô tô, điện lạnh, điện công nghiệp',
} as const;

export type SiteConfig = typeof siteConfig;
export default siteConfig;
