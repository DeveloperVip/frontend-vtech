'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
    <section className="relative overflow-hidden border-t border-slate-100 bg-gradient-to-b from-white via-sky-50/50 to-white py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex rounded-full border border-sky-100 bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              Dự án tiêu biểu
            </p>
            <h2 className="text-3xl font-extrabold leading-tight text-blue-950 md:text-5xl">
              Hình ảnh giải pháp rõ ràng, dễ hình dung
            </h2>
          </div>
          <p className="max-w-xl text-sm font-medium leading-7 text-slate-600 md:text-base">
            Khám phá các hạng mục trong phòng học thông minh qua ảnh minh họa lớn, thông tin gọn gàng và thao tác xem chi tiết nhanh.
          </p>
        </div>

        {productDomains.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-3">
            {productDomains.map((domain) => {
              const isActive = domain.id === activeDomainId;

              return (
                <button
                  key={domain.id}
                  id={`about-product-domain-tab-${domain.id}`}
                  type="button"
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`rounded-full border px-5 py-2 text-sm font-bold transition ${isActive
                    ? 'border-blue-900 bg-blue-900 text-white shadow-lg shadow-blue-900/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700'
                    }`}
                  aria-selected={isActive}
                >
                  {domain.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="rounded-[34px] border border-slate-200 bg-white p-2 shadow-[0_34px_110px_rgba(15,23,42,0.14)] md:p-3">
          <div className="relative">
            <button
              id="about-product-open-preview"
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="group relative block min-h-[520px] w-full cursor-zoom-in overflow-hidden rounded-[28px] bg-slate-950 text-left md:min-h-[680px] lg:min-h-[760px]"
              aria-label="Phóng to ảnh dự án"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentProject.id}
                  src={currentProject.image}
                  alt={currentProject.title}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.025] ${isSvgPreview ? 'bg-white object-contain' : 'object-cover'}`}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-white/42 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-10">
                <div className="max-w-3xl rounded-[24px] border border-white/70 bg-white/72 p-4 text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-md md:p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-sky-700">
                    {String(slideIndex + 1).padStart(2, '0')} / {String(activeDomain.projects.length).padStart(2, '0')} · {activeDomain.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-black leading-tight md:text-4xl lg:text-5xl">{currentProject.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-700">{currentProject.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <span className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/85 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-800 shadow-lg backdrop-blur transition group-hover:bg-white">
                Nhấn để phóng to
              </span>
            </button>

            <button
              id="about-product-slide-prev"
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-[260px] z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-white/90 text-slate-700 shadow-xl backdrop-blur transition hover:bg-white hover:text-blue-950 md:left-6 md:top-[340px] lg:top-[380px]"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              id="about-product-slide-next"
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-[260px] z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-blue-950/95 text-white shadow-xl backdrop-blur transition hover:bg-sky-700 md:right-6 md:top-[340px] lg:top-[380px]"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight size={22} />
            </button>

            <div className="mt-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {activeDomain.projects.map((item, index) => {
                  const active = index === slideIndex;

                  return (
                    <button
                      key={item.id}
                      id={`about-product-project-${item.id}`}
                      type="button"
                      onClick={() => setSlideIndex(index)}
                      className={`group overflow-hidden rounded-2xl border bg-white p-2 text-left transition-all duration-300 ${active
                        ? 'border-sky-400 shadow-[0_18px_45px_rgba(14,165,233,0.22)]'
                        : 'border-slate-200 hover:border-sky-200 hover:shadow-lg'
                        }`}
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className={`absolute inset-0 transition ${active ? 'ring-2 ring-inset ring-sky-400' : 'bg-slate-950/0 group-hover:bg-slate-950/8'}`} />
                      </span>
                      <span className="mt-2 flex items-center gap-2 px-1 pb-1">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${active ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="line-clamp-2 text-xs font-extrabold leading-snug text-slate-800">{item.title}</span>
                      </span>
                    </button>
                  );
                })}
              </div>            </div>

            {isZoomOpen && (
              <div
                id="about-product-lightbox"
                className="fixed inset-0 z-[120] bg-slate-950/92 px-3 py-4 backdrop-blur-sm md:px-8 md:py-8"
                onClick={() => setIsZoomOpen(false)}
              >
                <div
                  className="mx-auto flex h-full max-w-[1500px] flex-col gap-3"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black p-4 text-white backdrop-blur">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">
                        {String(slideIndex + 1).padStart(2, '0')} / {String(activeDomain.projects.length).padStart(2, '0')}
                      </p>
                      <h3 className="mt-2 text-lg font-extrabold md:text-2xl">{currentProject.title}</h3>
                      <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-200">{currentProject.description}</p>
                    </div>
                    <button
                      id="about-product-lightbox-close"
                      type="button"
                      onClick={() => setIsZoomOpen(false)}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                      aria-label="Đóng ảnh phóng to"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className={`relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/15 ${isSvgPreview ? 'bg-white' : 'bg-slate-100'} p-3 shadow-2xl md:p-5`}>
                    <button
                      id="about-product-lightbox-prev"
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg transition hover:bg-white hover:text-slate-950"
                      aria-label="Xem ảnh trước"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      id="about-product-lightbox-next"
                      type="button"
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-lg transition hover:bg-white hover:text-slate-950"
                      aria-label="Xem ảnh tiếp theo"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="h-full w-full object-contain object-center"
                    />
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
