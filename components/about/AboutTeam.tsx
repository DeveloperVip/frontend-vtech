'use client';

import { motion } from 'framer-motion';
import { Award, Target, Users } from 'lucide-react';

const staffRoles = [
  { icon: Award, title: 'Ban quản trị', count: '4 người', desc: '01 Chủ tịch HĐQT, 01 Giám đốc điều hành, 02 Phó giám đốc', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: Target, title: 'Phòng Kinh doanh', count: '10 người', desc: 'Trình độ cử nhân cao đẳng trở lên', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { icon: Users, title: 'Phòng Kỹ thuật - Sản xuất', count: '30 người', desc: 'Trình độ cao đẳng trở lên', bg: 'bg-sky-50', text: 'text-sky-600' },
  { icon: Users, title: 'Phòng Kế toán - Hành chính', count: '6 người', desc: 'Nhân viên kế toán chuyên nghiệp', bg: 'bg-slate-50', text: 'text-slate-600' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const }
  })
};

export default function AboutTeam() {
  return (
    <div className="max-w-7xl mx-auto px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-8 uppercase tracking-wider">Đội Ngũ Nhân Sự</h2>
        <p className="text-[#666] font-medium italic text-[15px]">Đội ngũ chuyên gia giàu kinh nghiệm và tận tâm</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-start text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-[16/10] bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white"
          >
            <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm bg-gray-100">
              {/* Placeholder for Team Meeting Image */}
              [Hình ảnh đội ngũ nhân sự]
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-blue-50/50 p-10 rounded-3xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-6 uppercase tracking-wide">Đội ngũ chuyên nghiệp</h3>
            <p className="text-[15px] text-blue-800/80 leading-[1.8] font-bold">
              Với đội ngũ kỹ thuật chuyên sâu, có kinh nghiệm và sự cộng tác của các giảng viên trong các trường đại học như Đại học Bách khoa Hà Nội, Đại học Công nghệ Giao thông vận tải.
            </p>
          </div>
          <div className="space-y-6 text-[#666] leading-[1.8] text-[15px] font-medium">
            <p>
              Vitechs cam kết đội ngũ nhân sự Sản xuất được đào tạo bài bản, có trình độ học vấn từ Cao đẳng, Đại học đến Thạc sĩ ở các ngành Cơ khí, Điện tử tự động hóa, Công nghệ ô tô, trong đó các kỹ sư cơ khí có kinh nghiệm hơn 10 năm trong nghề.
            </p>
            <p>
              Đặc biệt, đội ngũ nhân sự chịu trách nhiệm giảng dạy là các giảng viên có trình độ chuyên môn cao từ Thạc sĩ đến Phó Giáo sư, cùng với đó là các kỹ thuật viên cao cấp đến từ Toyota, Ford Việt Nam, Vietnam Airlines.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {staffRoles.map((role, idx) => (
          <motion.div 
            key={idx}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="bg-white p-8 rounded-3xl border border-gray-50 shadow-lg text-left"
          >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
              className={`w-12 h-12 ${role.bg} ${role.text} rounded-xl flex items-center justify-center mb-6 shadow-sm`}
            >
              <role.icon size={24} strokeWidth={1.5} />
            </motion.div>
            <h4 className="text-[14px] font-bold text-[#777] mb-2 uppercase tracking-wide">{role.title}</h4>
            <p className={`text-2xl font-black ${role.text} mb-3`}>{role.count}</p>
            <p className="text-[12px] text-[#888] font-medium leading-relaxed">{role.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
