'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

type ProductProject = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

type ProductDomain = {
  id: string;
  label: string;
  summary: string;
  accent: string;
  projects: ProductProject[];
};

const productDomains: ProductDomain[] = [
  // {
  //   id: 'automotive',
  //   label: 'Giải pháp đào tạo Ô tô',
  //   summary: 'Mô hình thực hành, bộ thí nghiệm và thiết bị chuẩn hóa cho trung tâm nghề.',
  //   accent: 'from-sky-500 to-cyan-400',
  //   projects: [
  //     {
  //       id: 'auto-1',
  //       title: 'Mô hình động cơ phun xăng điện tử',
  //       description:
  //         'Hệ mô phỏng toàn diện giúp học viên phân tích cảm biến, chẩn đoán lỗi và thực hành quy trình bảo dưỡng chuẩn hãng.',
  //       image: '/slider/360-product-photography-575px01.jpg',
  //       tags: ['OBD-II', 'CAN Bus', 'Thực hành chẩn đoán'],
  //     },
  //     {
  //       id: 'auto-2',
  //       title: 'Bộ mô phỏng hệ thống ABS/ESP',
  //       description:
  //         'Thiết bị trực quan hóa cơ chế phanh an toàn, cho phép giảng viên tạo tình huống lỗi và đánh giá năng lực xử lý thực tế.',
  //       image: '/slider/360-product-photography-575px11.jpg',
  //       tags: ['An toàn chủ động', 'Cảm biến tốc độ', 'Bài tập tình huống'],
  //     },
  //     {
  //       id: 'auto-3',
  //       title: 'Cabin điện thân xe thông minh',
  //       description:
  //         'Tích hợp hệ thống đèn, khóa, điều hòa và mạng truyền thông thân xe nhằm nâng cao năng lực sửa chữa điện ô tô hiện đại.',
  //       image: '/slider/360-product-photography-575px20.jpg',
  //       tags: ['Body Control', 'Điện thân xe', 'Đào tạo nâng cao'],
  //     },
  //     {
  //       id: 'auto-4',
  //       title: 'Mô hình hộp số tự động nâng cao',
  //       description:
  //         'Cho phép tháo lắp trực quan, đọc thông số điều khiển và luyện tập quy trình kiểm tra hộp số tự động trên các bài tập thực tiễn.',
  //       image: '/slider/360-product-photography-575px23.jpg',
  //       tags: ['Hộp số AT', 'Bảo dưỡng', 'Thực hành xưởng'],
  //     },
  //     {
  //       id: 'auto-5',
  //       title: 'Bộ thực hành hệ thống điều hòa ô tô',
  //       description:
  //         'Mô phỏng đầy đủ cụm lạnh, máy nén và cảm biến để học viên thực hành chẩn đoán, nạp gas, cân chỉnh theo tiêu chuẩn kỹ thuật.',
  //       image: '/slider/360-product-photography-575px29.jpg',
  //       tags: ['Điện lạnh ô tô', 'Chẩn đoán lỗi', 'Bài tập thao tác'],
  //     },
  //   ],
  // },
  // {
  //   id: 'electrical',
  //   label: 'Thiết bị Điện - Điện tử',
  //   summary: 'Phục vụ đào tạo kỹ thuật điện dân dụng, điện công nghiệp và tự động hóa.',
  //   accent: 'from-indigo-500 to-violet-400',
  //   projects: [
  //     {
  //       id: 'elec-1',
  //       title: 'Module PLC - HMI thực hành',
  //       description:
  //         'Giải pháp đồng bộ phần cứng và giáo trình, giúp học viên lập trình điều khiển dây chuyền mini theo tiêu chuẩn công nghiệp.',
  //       image: '/slider/360-product-photography-575px06.jpg',
  //       tags: ['PLC', 'HMI', 'Lập trình điều khiển'],
  //     },
  //     {
  //       id: 'elec-2',
  //       title: 'Bàn thực tập điện công nghiệp',
  //       description:
  //         'Tối ưu cho học phần lắp đặt tủ điện, đo kiểm và xử lý sự cố với đầy đủ bảo vệ an toàn trong môi trường đào tạo.',
  //       image: '/slider/360-product-photography-575px18.jpg',
  //       tags: ['Lắp đặt tủ điện', 'Đo kiểm', 'An toàn điện'],
  //     },
  //     {
  //       id: 'elec-3',
  //       title: 'Bộ thực hành biến tần - servo',
  //       description:
  //         'Cho phép triển khai bài toán điều khiển tốc độ, vị trí và đồng bộ chuyển động trong các mô hình sản xuất hiện đại.',
  //       image: '/slider/360-product-photography-575px34.jpg',
  //       tags: ['Biến tần', 'Servo', 'Automation'],
  //     },
  //     {
  //       id: 'elec-4',
  //       title: 'Mô hình điều khiển khí nén - điện',
  //       description:
  //         'Kết hợp mạch khí nén và điều khiển điện để đào tạo quy trình thiết kế, vận hành và xử lý lỗi dây chuyền tự động cơ bản.',
  //       image: '/slider/360-product-photography-575px14.jpg',
  //       tags: ['Pneumatic', 'Điều khiển liên động', 'Tự động hóa'],
  //     },
  //     {
  //       id: 'elec-5',
  //       title: 'Bộ thí nghiệm đo lường điện tử',
  //       description:
  //         'Trang bị đầy đủ bài thực hành dao động ký, cảm biến và mạch xử lý tín hiệu, phù hợp chương trình điện tử ứng dụng.',
  //       image: '/slider/360-product-photography-575px27.jpg',
  //       tags: ['Đo lường', 'Cảm biến', 'Điện tử ứng dụng'],
  //     },
  //   ],
  // },
  // {
  //   id: 'stem',
  //   label: 'Giáo dục STEM & phòng Lab',
  //   summary: 'Sản phẩm hướng tới tư duy sáng tạo, thực hành liên môn và học tập dự án.',
  //   accent: 'from-fuchsia-500 to-pink-400',
  //   projects: [
  //     {
  //       id: 'stem-1',
  //       title: 'Bộ học liệu robot giáo dục',
  //       description:
  //         'Học sinh tiếp cận lập trình và tư duy hệ thống qua các dự án robot tương tác, mở rộng theo nhiều cấp độ năng lực.',
  //       image: '/slider/360-product-photography-575px03.jpg',
  //       tags: ['Robotics', 'Project-based', 'Tư duy logic'],
  //     },
  //     {
  //       id: 'stem-2',
  //       title: 'Phòng thí nghiệm IoT mini',
  //       description:
  //         'Mô hình học tập tích hợp cảm biến, truyền dữ liệu và phân tích theo thời gian thực, phù hợp định hướng chuyển đổi số giáo dục.',
  //       image: '/slider/360-product-photography-575px16.jpg',
  //       tags: ['IoT', 'Cloud cơ bản', 'Thực nghiệm dữ liệu'],
  //     },
  //     {
  //       id: 'stem-3',
  //       title: 'Bộ thí nghiệm năng lượng tái tạo',
  //       description:
  //         'Giúp người học khám phá nguyên lý điện mặt trời, lưu trữ năng lượng và tối ưu hiệu suất trong hệ thống thực tế.',
  //       image: '/slider/360-product-photography-575px36.jpg',
  //       tags: ['Năng lượng xanh', 'Mô phỏng thực tế', 'Học qua trải nghiệm'],
  //     },
  //     {
  //       id: 'stem-4',
  //       title: 'Kit lập trình vi điều khiển thông minh',
  //       description:
  //         'Hỗ trợ học sinh xây dựng sản phẩm từ ý tưởng đến nguyên mẫu với cảm biến đa dạng, phù hợp các cuộc thi sáng tạo kỹ thuật.',
  //       image: '/slider/360-product-photography-575px09.jpg',
  //       tags: ['Vi điều khiển', 'Maker', 'Prototype'],
  //     },
  //     {
  //       id: 'stem-5',
  //       title: 'Không gian sáng tạo STEM tích hợp',
  //       description:
  //         'Thiết kế đồng bộ bàn học, thiết bị và học liệu cho mô hình lớp học trải nghiệm, thúc đẩy tư duy thiết kế và làm việc nhóm.',
  //       image: '/slider/360-product-photography-575px35.jpg',
  //       tags: ['STEM Lab', 'Thiết kế sáng tạo', 'Teamwork'],
  //     },
  //   ],
  // },
  {
    id: 'automotive',
    label: 'Phòng học thông minh',
    summary: 'Giải pháp lớp học số tích hợp hiển thị, điều khiển và quản trị nội dung giảng dạy hiện đại.',
    accent: 'from-sky-500 to-cyan-400',
    projects: [
      {
        id: 'auto-1',
        title: 'Màn hình tương tác 4K cho giảng dạy',
        description:
          'Tăng khả năng tương tác trực tiếp trên bài giảng với cảm ứng đa điểm, ghi chú thời gian thực và chia sẻ nội dung nhanh trong lớp học.',
        image: '/project/Phong-hoc-thong-minh/Picture1.svg',
        tags: ['Màn hình tương tác', '4K UHD', 'Cảm ứng đa điểm'],
      },
      {
        id: 'auto-2',
        title: 'Hệ thống quản lý nội dung lớp học (LMS)',
        description:
          'Đồng bộ tài liệu, bài tập và tiến độ học tập giữa giáo viên - học sinh, hỗ trợ dạy học kết hợp trực tiếp và trực tuyến.',
        image: '/project/Phong-hoc-thong-minh/Picture2.svg',
        tags: ['LMS', 'Đồng bộ đám mây', 'Dạy học kết hợp'],
      },
      {
        id: 'auto-3',
        title: 'Trung tâm điều khiển thiết bị lớp học IoT',
        description:
          'Quản lý ánh sáng, âm thanh, máy chiếu và điều hòa theo ngữ cảnh tiết học để tối ưu trải nghiệm dạy và học.',
        image: '/project/Phong-hoc-thong-minh/Picture3.svg',
        tags: ['Điều khiển IoT', 'Tự động hóa', 'Tiết kiệm năng lượng'],
      },
      {
        id: 'auto-4',
        title: 'Camera AI hỗ trợ ghi hình và phân tích tiết học',
        description:
          'Ghi hình thông minh, theo dõi người giảng, lưu trữ bài giảng và hỗ trợ phân tích mức độ tương tác để cải thiện chất lượng đào tạo.',
        image: '/project/Phong-hoc-thong-minh/Picture4.svg',
        tags: ['Camera AI', 'Ghi hình bài giảng', 'Phân tích dữ liệu'],
      },
      {
        id: 'auto-5',
        title: 'Hạ tầng Wi‑Fi 6 & thiết bị học tập số',
        description:
          'Đảm bảo kết nối ổn định cho nhiều thiết bị đồng thời, phục vụ bài giảng đa phương tiện và kiểm tra trực tuyến theo thời gian thực.',
        image: '/project/Phong-hoc-thong-minh/Picture6.svg',
        tags: ['Wi‑Fi 6', 'Mật độ cao', 'Lớp học số'],
      },
    ],
  },
];

export default function AboutProductShowcase() {
  const [activeDomainId, setActiveDomainId] = useState(productDomains[0].id);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeDomain = useMemo(
    () => productDomains.find((domain) => domain.id === activeDomainId) ?? productDomains[0],
    [activeDomainId]
  );

  useEffect(() => {
    setSlideIndex(0);
  }, [activeDomainId]);

  useEffect(() => {
    if (isZoomOpen) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % activeDomain.projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeDomain.projects.length, isZoomOpen]);

  useEffect(() => {
    if (!isZoomOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsZoomOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isZoomOpen]);

  const handleNext = () => {
    setSlideIndex((prev) => (prev + 1) % activeDomain.projects.length);
  };

  const handlePrev = () => {
    setSlideIndex((prev) => (prev - 1 + activeDomain.projects.length) % activeDomain.projects.length);
  };

  const currentProject = activeDomain.projects[slideIndex];
  const isSvgPreview = currentProject.image.toLowerCase().endsWith('.svg');

  return (
    <section className="relative overflow-hidden border-t border-slate-100 bg-white py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-10 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-24 right-16 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-2 md:px-4">
        <div className="mb-14 text-center">
          {/* <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-700">
            <Sparkles size={14} className="text-cyan-500" />
            Featured Projects
          </p> */}
          <h2 className="text-3xl font-extrabold uppercase tracking-wide text-blue-900 md:text-5xl">Dự án tiêu biểu</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[15px] font-medium italic text-slate-500">
            Khám phá từng nhóm giải pháp nổi bật của VITECHS qua cụm tab giới thiệu và slider trực quan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_2.05fr] lg:gap-12">
          <div className="space-y-4">
            {productDomains.map((domain) => {
              const isActive = domain.id === activeDomainId;

              return (
                <button
                  key={domain.id}
                  id={`about-product-domain-tab-${domain.id}`}
                  type="button"
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`group w-full rounded-3xl border p-6 text-left transition-all duration-300 ${isActive
                    ? 'border-transparent bg-slate-900 text-white shadow-2xl shadow-slate-900/30'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'
                    }`}
                  aria-selected={isActive}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-extrabold uppercase tracking-wide md:text-lg">{domain.label}</h3>
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-all ${isActive ? 'bg-white/15' : 'bg-slate-100'
                        }`}
                    >
                      <ArrowRight
                        size={16}
                        className={`transition-transform ${isActive ? 'text-white' : 'text-slate-500 group-hover:translate-x-0.5'}`}
                      />
                    </span>
                  </div>

                  <p className={`mt-3 text-sm leading-relaxed ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                    {domain.summary}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className={`text-xs font-bold uppercase tracking-[0.12em] ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                      {domain.projects.length} dự án tiêu biểu
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {domain.projects.slice(0, 4).map((item) => (
                      <span
                        key={item.id}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                      >
                        {item.tags[0]}
                      </span>
                    ))}
                  </div>

                  {isActive && <div className={`mt-4 h-1.5 w-40 rounded-full bg-gradient-to-r ${domain.accent}`} />}
                </button>
              );
            })}
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:p-3">
            <div className="relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-950">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.id}
                  initial={{ opacity: 0, x: 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -36 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    id="about-product-open-preview"
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="relative block w-full cursor-zoom-in h-full"
                    aria-label="Phóng to ảnh dự án"
                  >
                    <div className={`relative h-[420px] w-full md:h-[520px] lg:h-[620px] ${isSvgPreview ? 'flex items-center justify-center bg-slate-950 p-5 md:p-6' : ''}`}>
                      <img
                        src={currentProject.image}
                        alt={currentProject.title}
                        className={`${isSvgPreview ? 'h-full w-full object-contain' : 'h-full w-full object-cover'} object-center`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-transparent" />
                      {/* <div className="absolute bottom-3 right-3 rounded-full border border-white/35 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                        Nhấn để phóng to
                      </div> */}
                      <div className="absolute left-0 right-0 top-0 p-6">
                        <h3 className="text-xl font-extrabold text-white md:text-2xl">{currentProject.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-200">{currentProject.description}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {currentProject.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-40 mx-4 mt-[-6%] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {activeDomain.projects.map((item, index) => {
                  const active = index === slideIndex;
                  return (
                    <button
                      key={item.id}
                      id={`about-product-slide-dot-${item.id}`}
                      type="button"
                      onClick={() => setSlideIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${active ? 'w-8 bg-sky-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                      aria-label={`Đi tới ảnh ${index + 1}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="about-product-slide-prev"
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  id="about-product-slide-next"
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {isZoomOpen && (
              <div
                id="about-product-lightbox"
                className="fixed inset-0 z-[120] bg-slate-950/88 backdrop-blur-sm"
                onClick={() => setIsZoomOpen(false)}
              >
                <div className="flex h-full items-end justify-center px-3 pb-3 pt-16 md:px-8 md:pb-8 md:pt-20">
                  <div
                    className={`relative w-full h-full overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl ${isSvgPreview ? 'max-w-[1080px]' : 'max-w-[1500px]'}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      id="about-product-lightbox-close"
                      type="button"
                      onClick={() => setIsZoomOpen(false)}
                      className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:bg-black/70"
                      aria-label="Đóng ảnh phóng to"
                    >
                      <X size={18} />
                    </button>

                    <button
                      id="about-product-lightbox-prev"
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white transition hover:bg-black/70"
                      aria-label="Xem ảnh trước"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      id="about-product-lightbox-next"
                      type="button"
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white transition hover:bg-black/70"
                      aria-label="Xem ảnh tiếp theo"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div
                      className={`relative w-full h-full bg-slate-950 ${isSvgPreview ? 'flex items-center justify-center px-4 pb-4 pt-16 md:px-6 md:pb-6 md:pt-20' : 'aspect-[16/9]'}`}
                    >
                      <img
                        src={currentProject.image}
                        alt={currentProject.title}
                        className={`object-center ${isSvgPreview
                          ? 'h-full w-full w-auto max-w-full object-contain'
                          : 'h-full w-full object-cover'
                          }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/45 to-transparent" />
                      <div className="absolute left-0 right-0 top-0 p-6 md:p-8">
                        <h3 className="text-2xl font-extrabold text-white md:text-3xl">{currentProject.title}</h3>
                        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-200 md:text-base">
                          {currentProject.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {currentProject.tags.map((tag) => (
                            <span
                              key={`zoom-${tag}`}
                              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
