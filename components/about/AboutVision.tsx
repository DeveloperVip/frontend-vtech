'use client';

import { easeInOut, motion } from 'framer-motion';
import { Eye, Target, TrendingUp, Lightbulb } from 'lucide-react';

const visionItems = [
  { 
    icon: Eye, 
    title: 'Tầm nhìn', 
    desc: 'Tiếp tục phát triển, giữ vững vị thế là một trong những doanh nghiệp hàng đầu Việt Nam về lĩnh vực cung cấp các thiết bị đào tạo, thiết bị dạy nghề.',
    color: 'bg-blue-600',
    shadow: 'shadow-blue-500/20'
  },
  { 
    icon: Target, 
    title: 'Mục tiêu', 
    desc: 'Cung cấp những mặt hàng thương mại có chất lượng cao nhất, đáp ứng tốt với yêu cầu của khách hàng, tạo niềm tin vững chắc nơi khách hàng, là lựa chọn số 1 của người tiêu dùng.',
    color: 'bg-green-500',
    shadow: 'shadow-green-500/20'
  },
  { 
    icon: TrendingUp, 
    title: 'Phát triển', 
    desc: 'Đào tạo và phát triển đội ngũ nhân lực có trình độ cao, chuyên môn sâu trong từng lĩnh vực, nhiệt huyết và tận tâm phục vụ khách hàng.',
    color: 'bg-purple-600',
    shadow: 'shadow-purple-500/20'
  },
];

const mainItem = {
  icon: Lightbulb,
  title: 'Mô hình dạy học',
  desc: 'VITECHS., JSC được thành lập năm 2009 tại Hà Nội với mong muốn phát triển các sản phẩm giáo cụ trực quan, sản phẩm dạy nghề hỗ trợ các giảng viên trình bày phương pháp thực hành để giảng dạy và học sinh sinh viên học các kỹ năng chẩn đoán và sửa chữa cho các ngành Cơ khí; Điện, Điện tử; nghề Điện công nghiệp; Điện tử; Điện lạnh; Cơ khí; Ô tô.',
  color: 'bg-orange-500',
  shadow: 'shadow-orange-500/20'
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut, } }
};

export default function AboutVision({ config }: { config?: any }) {
  return (
    <div className="space-y-12">
      {/* Top 3 Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {visionItems.map((item, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="bg-white p-10 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-start text-left relative overflow-hidden group hover:shadow-xl transition-shadow duration-500"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
              className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${item.shadow} relative z-10`}
            >
              <item.icon size={24} strokeWidth={2} />
            </motion.div>
            <h3 className="text-lg font-bold text-[#1e293b] mb-4 relative z-10">{item.title}</h3>
            <p className="text-[14px] text-[#64748b] leading-[1.8] font-medium relative z-10">
              {item.desc}
            </p>
            {/* Subtle Gradient Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] blur-3xl -mr-16 -mt-16`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex justify-center pt-4"
      >
        <div className="bg-white p-10 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col md:flex-row items-start md:items-center gap-8 max-w-4xl w-full relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className={`w-14 h-14 ${mainItem.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${mainItem.shadow} flex-shrink-0 relative z-10`}
          >
            <mainItem.icon size={30} strokeWidth={2} />
          </motion.div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[#1e293b] mb-3">{mainItem.title}</h3>
            <p className="text-[14px] text-[#64748b] leading-[1.8] font-medium">
              {mainItem.desc}
            </p>
          </div>
          {/* Subtle Gradient Glow */}
          <div className={`absolute top-0 left-0 w-40 h-40 ${mainItem.color} opacity-[0.03] blur-3xl -ml-20 -mt-20`} />
        </div>
      </motion.div>
    </div>
  );
}
