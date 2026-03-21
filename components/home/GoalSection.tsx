'use client';

import Link from 'next/link';
import { Settings, Zap, Car, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const itemRight = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const goals = [
  'Tiếp tục phát triển, giữ vững vị thế là một trong những doanh nghiệp hàng đầu Việt Nam về lĩnh vực cung cấp thiết bị đào tạo, thiết bị dạy nghề.',
  'Cung cấp những mặt hàng thương mại có chất lượng cao nhất, đáp ứng tốt với yêu cầu của khách hàng, tạo niềm tin vững chắc nơi khách hàng.',
  'Đào tạo và phát triển đội ngũ nhân lực có trình độ cao, chuyên môn sâu trong từng lĩnh vực, nhiệt huyết và tận tâm phục vụ khách hàng.',
];

const features = [
  { label: 'Ngành Cơ khí', icon: <Settings size={32} className="text-gray-300 drop-shadow-md" /> },
  { label: 'Ngành Điện – Điện tử', icon: <Zap size={32} className="text-orange-400 drop-shadow-md" /> },
  { label: 'Công nghệ ô tô', icon: <Car size={32} className="text-red-500 drop-shadow-md" /> },
  { label: 'Điện lạnh', icon: <Snowflake size={32} className="text-cyan-300 drop-shadow-md" /> },
];

export default function GoalSection() {
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(90deg,rgba(69, 133, 230, 1) 0%, rgba(54, 132, 247, 1) 0%)' }}>


      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="max-w-[1440px] mx-auto px-2 md:px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-white lg:pr-10"
        >
          <motion.h2 variants={itemLeft} className="text-4xl font-extrabold mb-10 tracking-tight text-white drop-shadow-sm">Mục tiêu</motion.h2>

          <ul className="flex flex-col gap-6 mb-12">
            {goals.map((g, i) => (
              <motion.li variants={itemLeft} key={i} className="flex items-start gap-5">
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm text-white text-[13px] flex items-center justify-center shrink-0 font-bold shadow-inner border border-white/10 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-blue-50 text-[15px] leading-relaxed">
                  {g}
                </p>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={itemLeft} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-fit">
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {features.map((item, idx) => (
            <motion.div
              variants={itemRight}
              key={idx}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white border border-white/10 flex flex-col items-center justify-center min-h-[160px] cursor-pointer shadow-lg hover:bg-white/20 hover:shadow-xl transition-colors duration-300"
            >
              {/* thêm hiệu ứng rung lắc nhẹ */}
              <div className="mb-4 transform group-hover:animate-wiggle transition-transform duration-300 relative z-10">
                {item.icon}
              </div>
              <p className="text-[15px] font-semibold tracking-wide relative z-10">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
