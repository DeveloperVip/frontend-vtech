'use client';

import { motion } from 'framer-motion';
import { Eye, Award, Target, Users } from 'lucide-react';

const stats = [
  { icon: Eye, label: '15+ Năm', sub: 'Kinh nghiệm' },
  { icon: Award, label: 'Uy tín', sub: 'Top 100 thương hiệu' },
  { icon: Target, label: 'Chất lượng', sub: 'Tiêu chuẩn quốc tế' },
  { icon: Users, label: '50+ Nhân sự', sub: 'Kỹ sư chuyên nghiệp' },
];

export default function AboutStats() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-5xl mx-auto"
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
            className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-sm border border-blue-100"
          >
            <stat.icon size={28} strokeWidth={1.5} />
          </motion.div>
          <p className="text-[15px] font-bold text-[#333] uppercase tracking-wide mb-1">{stat.label}</p>
          <p className="text-[13px] text-[#777] font-medium leading-tight">{stat.sub}</p>
        </div>
      ))}
    </motion.div>
  );
}
