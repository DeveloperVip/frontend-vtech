'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultTestimonials = [
  {
    text: "Thiết bị được Vitechs cung cấp có chất lượng tuyệt vời, tính ứng dụng cao và giao diện dễ sử dụng. Đội ngũ tư vấn vô cùng nhiệt tình, giải quyết các vấn đề của chúng tôi rất nhanh chóng. Tôi thực sự hài lòng!",
    name: "Nguyễn Văn Tuấn",
    role: "Giám đốc Kỹ thuật - Auto Hanoi",
  },
  {
    text: "Kể từ khi sử dụng giải pháp tự động hóa của Vitechs, hiệu suất đào tạo thực hành của trường chúng tôi đã tăng lên đáng kể. Sản phẩm đáp ứng hoàn hảo nhu cầu và tài liệu kèm theo rất chi tiết, dễ hiểu.",
    name: "Lê Minh Hà",
    role: "Trưởng khoa Cơ Khí - ĐH Công Nghiệp",
  },
  {
    text: "Sự hỗ trợ kỹ thuật và dịch vụ chăm sóc khách hàng xuất sắc! Chúng tôi tích hợp hệ thống máy móc của Vitechs vào dây chuyền sản xuất và nhận thấy sự cải thiện rõ rệt về độ ổn định. Rất đáng đồng tiền bát gạo.",
    name: "Phạm Hải Đăng",
    role: "CEO - TechPro Việt Nam",
  },
  {
    text: "Tôi đã tìm kiếm một đối tác tin cậy cung cấp thiết bị giáo cụ trực quan trong nhiều năm qua và Vitechs chính là câu trả lời. Giao hàng đúng hạn, lắp đặt chuyên nghiệp và luôn sẵn sàng hỗ trợ khi cần thiết.",
    name: "Trần Thị Hằng",
    role: "Trung tâm Đào tạo Nghề",
  },
  {
    text: "Phần mềm tích hợp với hệ thống điều khiển hoạt động rất mượt mà. Đội ngũ kỹ thuật của Vitechs có chuyên môn sâu, luôn hỗ trợ giải mã các vướng mắc của chúng tôi ngay cả trong ngày nghỉ. Chắc chắn sẽ quay lại!",
    name: "Hoàng Nhật Minh",
    role: "Quản lý Dự án - VinaTech",
  }
];

export default function CustomerFeedback() {
  const [items, setItems] = useState(defaultTestimonials);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setItems((prev) => {
        const nextArr = [...prev];
        const first = nextArr.shift()!;
        nextArr.push(first);
        return nextArr;
      });
    }, 4500); // 4.5s auto play
    return () => clearInterval(timer);
  }, [isHovered]);

  const next = () => {
    setDirection(1);
    setItems((prev) => {
      const nextArr = [...prev];
      const first = nextArr.shift()!;
      nextArr.push(first);
      return nextArr;
    });
  };

  const prev = () => {
    setDirection(-1);
    setItems((prev) => {
      const nextArr = [...prev];
      const last = nextArr.pop()!;
      nextArr.unshift(last);
      return nextArr;
    });
  };

  const variants = {
    initial: ({ dir }: { dir: number; index: number }) => ({
      opacity: 0,
      x: dir === 1 ? 150 : -150,
      scale: 0.8,
      filter: 'blur(2px)',
    }),
    animate: ({ index }: { dir: number; index: number }) => ({
      opacity: index === 1 ? 1 : 0.4,
      filter: index === 1 ? 'blur(0px)' : 'blur(1.5px)',
      x: 0,
      scale: index === 1 ? 1.08 : 0.85,
      zIndex: index === 1 ? 20 : 10,
      transition: { duration: 0.7 }
    }),
    exit: ({ dir }: { dir: number; index: number }) => ({
      opacity: 0,
      x: dir === 1 ? -150 : 150,
      scale: 0.8,
      zIndex: 0,
      filter: 'blur(2px)',
      transition: { duration: 0.5 }
    })
  };

  return (
    <section className="bg-white py-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl md:text-[34px] font-extrabold text-blue-900 mb-4 uppercase tracking-tight">
          Phản Hồi Từ Khách Hàng
        </h2>
        <p className="text-gray-600 text-[14.5px] font-medium max-w-3xl mx-auto">
          Vitechs trân trọng mọi ý kiến đóng góp nhằm không ngừng cải tiến và tối ưu hóa giải pháp, đáp ứng hoàn hảo những nhu cầu đặc thù của từng đối tác.
        </p>
      </div>

      <div className="w-full max-w-[1500px] mx-auto py-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}>

        <div className="relative z-0 mx-[2%] lg:mx-[3%] bg-blue-50 rounded-[30px] py-16">
          <div className="relative z-10 flex justify-center items-center h-[360px] w-full gap-4 lg:gap-8 px-4">
            <AnimatePresence mode="popLayout" custom={{ dir: direction, index: 0 }}>
              {items.slice(0, 3).map((t, idx) => {
                const isActive = idx === 1;
                return (
                  <motion.div
                    key={t.name}
                    layout
                    custom={{ dir: direction, index: idx }}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`relative w-[260px] md:w-[350px] bg-white p-8 rounded-2xl border flex flex-col shrink-0 cursor-pointer
                      ${isActive ? 'border-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)]' : 'border-blue-50/50 shadow-md'}
                    `}
                  >
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />)}
                    </div>

                    <p className={`text-gray-600 text-[13px] leading-relaxed mb-auto overflow-hidden transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                      {t.text}
                    </p>

                    <div className="mt-8 pt-4 border-t border-gray-100">
                      <h4 className="font-extrabold text-blue-900 text-[15px] tracking-wide">{t.name}</h4>
                      <p className="text-gray-500 text-[11px] mt-1 tracking-wider uppercase font-bold">{t.role}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative z-20 flex justify-center gap-5 mt-10 pointer-events-auto">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full bg-white text-blue-700 shadow-md flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-50"
            aria-label="Previous feedback"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full bg-white text-blue-700 shadow-md flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-50"
            aria-label="Next feedback"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
