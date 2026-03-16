<<<<<<< HEAD
'use client';

import { BookOpen, Wrench, Users, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

const items = [
  {
    icon: <BookOpen size={36} strokeWidth={1.5} />,
    title: 'MÔ HÌNH DẠY HỌC',
    desc: 'Phát triển các sản phẩm giáo cụ trực quan, hỗ trợ giảng viên trình bày phương pháp thực hành cho các ngành Cơ khí, Điện, Điện tử, Ô tô…',
  },
  {
    icon: <Wrench size={36} strokeWidth={1.5} />,
    title: 'DỊCH VỤ SỬA CHỮA',
    desc: 'Mở các lớp đào tạo nghề ngắn hạn, đảm bảo đầu ra chuẩn. Cung cấp dịch vụ bảo dưỡng, sửa chữa thiết bị, máy công trình, dây chuyền công nghiệp.',
  },
  {
    icon: <Users size={36} strokeWidth={1.5} />,
    title: 'NHÂN SỰ KỸ THUẬT',
=======
import { BookOpen, Wrench, Users } from 'lucide-react';

const items = [
  {
    icon: <BookOpen size={28} />,
    title: 'Mô hình dạy học',
    desc: 'Phát triển các sản phẩm giáo cụ trực quan, hỗ trợ giảng viên trình bày phương pháp thực hành cho các ngành Cơ khí, Điện, Điện tử, Ô tô…',
  },
  {
    icon: <Wrench size={28} />,
    title: 'Dịch vụ',
    desc: 'Mở các lớp đào tạo nghề ngắn hạn, đảm bảo đầu ra chuẩn. Cung cấp dịch vụ bảo dưỡng, sửa chữa thiết bị, máy công trình, dây chuyền công nghiệp.',
  },
  {
    icon: <Users size={28} />,
    title: 'Nhân sự',
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
    desc: 'Đội ngũ kỹ sư cơ khí hơn 10 năm kinh nghiệm. Giảng viên từ Thạc sĩ đến Phó Giáo sư, kỹ thuật viên cao cấp từ Toyota, Ford, Vietnam Airlines.',
  },
];

export default function AboutSection({ config }: { config?: Record<string, string> }) {
  return (
<<<<<<< HEAD
    <section id="gioi-thieu" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Giới thiệu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#333] uppercase tracking-wider mb-8">
            GIỚI THIỆU VỀ VITECHS
          </h2>

          <p className="text-[#666] max-w-4xl mx-auto text-[15px] leading-[1.8]">
            {config?.about_content ||
              'VITECHS., JSC được thành lập năm 2009 tại Hà Nội với mong muốn phát triển các sản phẩm giáo cụ trực quan, sản phẩm dạy nghề hỗ trợ các giảng viên và học sinh sinh viên chuyên sâu vào thực hành.'}
          </p>
        </motion.div>


        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
        >
          {items.map((item) => (
            <motion.div variants={itemVariants} key={item.title} className="text-center">
              {/* Vòng tròn logo */}
              <div className="w-24 h-24 mx-auto bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-[#2563EB] mb-6 shadow-sm">
                {item.icon}
              </div>

              <h3 className="font-bold text-[#333] text-[15px] uppercase tracking-wide">{item.title}</h3>
              {/* Gạch chân */}
              <div className="w-[80px] h-[2px] bg-[#2563EB] mx-auto my-4 opacity-50" />

              <p className="text-[#777] text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>


      <img
        src="/car-left.png"
        alt="Car Left"
        className="absolute left-[-5%] bottom-0 w-[500px] object-contain opacity-95 hidden lg:block z-0 pointer-events-none"
      />

      <img
        src="/car-left.png"
        alt="Car Right"
        className="absolute right-[-5%] bottom-0 w-[500px] object-contain opacity-95 hidden lg:block z-0 pointer-events-none scale-x-[-1]"
      />
=======
    <section id="gioi-thieu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Giới thiệu về Vitechs</h2>
          <div className="w-16 h-1 bg-primary-700 mx-auto rounded" />
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            {config?.about_content ||
              'VITECHS., JSC được thành lập năm 2009 tại Hà Nội với mong muốn phát triển các sản phẩm giáo cụ trực quan, sản phẩm dạy nghề hỗ trợ các giảng viên và học sinh sinh viên.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.title}
              className="p-6 border border-gray-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
    </section>
  );
}
