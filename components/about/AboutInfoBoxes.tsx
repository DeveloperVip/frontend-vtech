'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';

export default function AboutInfoBoxes() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-12"
    >
      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg flex items-start gap-5">
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 border border-blue-100"
        >
          <FileText size={28} strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-[15px] font-bold text-[#333] mb-2 uppercase tracking-wide">Thông tin doanh nghiệp</p>
          <p className="text-[14px] text-[#777] font-medium leading-relaxed">Mã số thuế: 103770152</p>
        </div>
      </div>
      <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg flex items-start gap-5">
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 border border-indigo-100"
        >
          <Calendar size={28} strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-[15px] font-bold text-[#333] mb-2 uppercase tracking-wide">Thành lập</p>
          <p className="text-[14px] text-[#777] font-medium leading-relaxed">Năm 2009 tại Hà Nội</p>
        </div>
      </div>
    </motion.div>
  );
}
