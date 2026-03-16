<<<<<<< HEAD
'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function HeroSection({ config }: { config?: Record<string, string> }) {
  return (
    <section
      className="relative min-h-[600px] flex items-center text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #a855f7 50%, #d946ef 100%)'
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        <motion.div 
          className="pr-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-wide uppercase shadow">
            Thành lập 2009 · Hà Nội
          </motion.span>
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            {config?.hero_title || 'VITECHS., JSC'}
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-white/90 text-[15px] leading-relaxed mb-10 max-w-[480px]">
             {config?.hero_subtitle || 'Chuyên cung cấp thiết bị đào tạo, thiết bị dạy nghề, đáp ứng nhu cầu thực tiễn và chuyên nghiệp.'}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/san-pham"
                className="flex items-center justify-center gap-2 bg-white text-[#2563EB] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.3)] transition-all w-fit">
                Xem sản phẩm <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/lien-he"
                className="flex items-center justify-center gap-2 border border-white/50 bg-white/10 backdrop-blur-sm text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-white/20 transition-all w-fit">
                Liên hệ ngay
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ảnh */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative aspect-square md:aspect-auto md:h-[500px] w-full max-w-[500px] mx-auto hidden md:block"
        >
          {/* khung viền ảnh */}
          <div className="w-full h-full bg-black rounded-[32px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 opacity-80"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), repeating-linear-gradient(45deg, #222 25%, #111 25%, #111 75%, #222 75%, #222)',
                backgroundPosition: '0 0, 10px 10px',
                backgroundSize: '20px 20px'
              }}
            />
            <img src="/hero-abstract.png" alt="Hero Graphic" className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-50" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex flex-col items-center justify-center min-w-[100px] z-10 transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm mb-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" /> 4.9/5
            </div>
            <p className="text-[#6b7280] text-[10px] font-medium uppercase tracking-wider">Đánh giá cao</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center min-w-[110px] z-10 transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="font-bold text-[#2563EB] text-xl mb-0.5">1000+</p>
            <p className="text-[#6b7280] text-[10px] font-medium uppercase tracking-wider">Khách hàng</p>
          </motion.div>
        </motion.div>
=======
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({ config }: { config?: Record<string, string> }) {
  return (
    <section className="relative min-h-[540px] flex items-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Thành lập 2009 · Hà Nội
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {config?.hero_title || 'VITECHS., JSC'}
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-lg">
            {config?.hero_subtitle || 'Thiết bị đào tạo – Giáo cụ trực quan – Dạy nghề chuyên nghiệp'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/san-pham"
              className="flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Xem sản phẩm <ArrowRight size={16} />
            </Link>
            <Link href="/lien-he"
              className="flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
              Liên hệ ngay
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { number: '15+', label: 'Năm kinh nghiệm' },
            { number: '500+', label: 'Sản phẩm' },
            { number: '1000+', label: 'Khách hàng' },
            { number: '50+', label: 'Đối tác' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
              <p className="text-3xl font-bold">{s.number}</p>
              <p className="text-primary-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
      </div>
    </section>
  );
}
