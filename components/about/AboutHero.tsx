'use client';

import { motion } from 'framer-motion';
import { Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import OrbBackground from '@/ultilites/OrbBackground';
import RippleGridBackground from '../../ultilites/RippleGridBackground';

interface AboutHeroProps {
  config: any;
}

export default function AboutHero({ config }: AboutHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 text-white"
      style={{ background: 'linear-gradient(90deg,rgba(215, 247, 250, 1) 0%, rgba(69, 133, 230, 1) 0%, rgba(188, 160, 250, 1) 100%, rgba(124, 166, 230, 1) 82%)' }}
    >
      <RippleGridBackground intensity='bold' />

      <div className="max-w-[1440px] mx-auto px-2 md:px-4 relative z-10 text-white text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Content */}
          <div className="flex flex-col items-start text-left">
            <motion.span variants={itemVariants} className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-[10px] font-bold tracking-wide mb-6 shadow-sm">
              15 năm kinh nghiệm
            </motion.span>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-none mb-4 tracking-tight drop-shadow-xl uppercase">
              VITECHS., JSC
            </motion.h1>

            <motion.h2 variants={itemVariants} className="text-base md:text-lg lg:text-xl font-bold text-blue-50 leading-tight mb-4 tracking-wide uppercase opacity-90">
              CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI <br className="hidden md:block" /> VÀ DỊCH VỤ CÔNG NGHỆ VIỆT
            </motion.h2>

            <motion.p variants={itemVariants} className="text-[11px] font-bold text-blue-100/60 uppercase tracking-[0.2em] mb-8 leading-relaxed max-w-xl">
              VIET TECHNOLOGY SERVICE AND TRADING INVESTMENT JOINT STOCK COMPANY
            </motion.p>

            <motion.p variants={itemVariants} className="text-white/90 text-[15px] leading-[1.8] mb-8 max-w-xl font-medium border-l-2 border-white/20 pl-4 italic">
              Nhà cung cấp thiết bị thí nghiệm, đào tạo và dạy nghề uy tín tại Việt Nam, chuyên sản xuất và phân phối các mô hình học cụ phục vụ dạy nghề Điện công nghiệp, Tự động hóa, Cơ khí, Ô tô, Điện lạnh.
            </motion.p>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group lg:ml-auto"
          >
            <div className="absolute -inset-4 bg-white/10 rounded-[40px] blur-2xl group-hover:bg-white/20 transition-all duration-500" />
            <div className="relative aspect-[3/2] w-full lg:w-[650px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/20 bg-white/5 backdrop-blur-sm">
              {config.about_image ? (
                <img src={config.about_image} alt="Về Vitechs" className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center animate-pulse bg-white/10 text-white/20">
                  {/* Empty image placeholder */}
                </div>
              )}
            </div>

            {/* Floating Badge (Refined) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3 px-4 rounded-xl shadow-lg hidden md:block border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white scale-90">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">Top 100</p>
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">Thương hiệu uy tín</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
