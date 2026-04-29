'use client';

import { motion } from 'framer-motion';

export default function AboutServices() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-4 bg-blue-100/30 rounded-[32px] blur-2xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-[16/10] bg-gray-100 rounded-[24px] overflow-hidden shadow-xl border-4 border-white"
        >
          <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
            {/* Placeholder for Wood Workshop Image */}
            <img src="/project/anh-xuong-2.jpg" alt="Services" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-8 border-l-4 border-blue-600 pl-6 uppercase tracking-wider">Dịch vụ chất lượng cao</h2>
        <div className="space-y-6 text-[#666] leading-[1.8] text-[15px] font-medium">
          <p>
            Bên cạnh việc cung cấp các sản phẩm chất lượng tới tay khách hàng, chúng tôi còn mở các lớp đào tạo nghề ngắn hạn, đảm bảo đầu ra chuẩn theo các yêu cầu kỹ năng nghề hiện hành ở các ngành điện, điện tử, điện lạnh, sơn.
          </p>
          <p>
            Đồng thời cung cấp các dịch vụ như bảo dưỡng, sửa chữa đối với các thiết bị, máy công trình, dây chuyền công nghiệp.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
