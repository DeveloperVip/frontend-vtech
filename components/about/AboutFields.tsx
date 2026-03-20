'use client';

import { motion } from 'framer-motion';

const fields = [
  { icon: '🚗', title: 'Dạy nghề Ô tô', desc: 'Sản xuất thiết bị, mô hình phục vụ dạy nghề ô tô' },
  { icon: '⚡', title: 'Dạy nghề Điện', desc: 'Sản xuất thiết bị, mô hình phục vụ dạy nghề Điện' },
  { icon: '🎓', title: 'Giáo dục phổ thông', desc: 'Sản xuất thiết bị, mô hình phục vụ giáo dục phổ thông' },
  { icon: '⚙️', title: 'Máy móc thiết bị', desc: 'Cung cấp các thiết bị máy móc chất lượng cao' },
  { icon: '📦', title: 'Sản phẩm cơ khí', desc: 'Sản xuất các sản phẩm cơ khí, điện, điện tử' },
  { icon: '💻', title: 'Phần mềm bản quyền', desc: 'Phân phối các phần mềm bản quyền' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const }
  },
};

export default function AboutFields() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {fields.map((item, idx) => (
        <motion.div 
          key={idx} 
          variants={itemVariants}
          className="bg-white p-10 rounded-3xl border border-gray-50 shadow-lg text-center relative overflow-hidden group"
        >
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.4
            }}
          >
            <div className="text-4xl mb-6 inline-block">
              {item.icon}
            </div>
            <h3 className="text-[15px] font-bold text-[#333] mb-4 uppercase tracking-wide">{item.title}</h3>
            <p className="text-[14px] text-[#777] leading-[1.6] font-medium">
              {item.desc}
            </p>
          </motion.div>
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30 transition-colors duration-500" />
        </motion.div>
      ))}
    </motion.div>
  );
}
