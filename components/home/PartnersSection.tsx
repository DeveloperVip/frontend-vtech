'use client';

import { motion } from 'framer-motion';

const partnerLogos = [
  ...[
    { name: 'Kistler', src: '/logo/Mitsubishi.png' },
    { name: 'Bosch', src: '/logo/bosch.png' },
    { name: 'Volkswagen', src: '/logo/toyota.png' },
    { name: 'Wipko', src: '/logo/ford.png' },
    { name: 'Koeng', src: '/logo/sie.png' },
    { name: 'Siemens', src: '/logo/vna.png' },
  ]
];

export default function PartnersSection() {
  return (
    <section className="py-20 bg-white">
      <div className="overflow-hidden w-full relative mb-20">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex gap-16 items-center w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <div key={index} className="w-[180px] flex justify-center items-center h-20 shrink-0">
              <img
                src={logo.src}
                alt={`Partner ${logo.name}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Column: Heading */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-[#1e3a8a] leading-[1.1] uppercase tracking-tight">
              Lời cảm ơn gửi đến <br className="hidden md:block" /> đối tác và khách hàng
            </h2>
          </div>

          {/* Right Column: Description */}
          <div className="text-gray-600 space-y-4">
            <p className="text-base md:text-[17px] leading-relaxed">
              Chúng tôi xin gửi lời cảm ơn chân thành tới các đối tác đã luôn ủng hộ và đặt trọn sự tin tưởng vào Vitechs. Sự hợp tác vô giá của quý vị chính là động lực thúc đẩy sự phát triển và hoàn thiện không ngừng của chúng tôi. Vitechs luôn trân trọng mọi cơ hội được đồng hành và cam kết mang lại những giải pháp tối ưu nhất, đóng góp vào sự thành công chung của cả hai bên.
            </p>
            <p className="text-lg font-bold italic text-gray-800">
              Trân trọng cảm ơn!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
