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
      <div className="max-w-6xl mx-auto px-4">

        {/* Giới thiệu */}
        <div className="text-center mb-16">
          <h2 className="text-[28px] font-bold text-[#555] uppercase tracking-wider mb-3">Đối tác</h2>
          <p className="text-center text-gray-500 text-[15px]">Một số đối tác tiêu biểu của chúng tôi</p>
        </div>
      </div>

      <div className="overflow-hidden w-full relative">
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
    </section>
  );
}
