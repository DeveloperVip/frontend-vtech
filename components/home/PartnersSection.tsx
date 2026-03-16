<<<<<<< HEAD
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
=======
import Link from 'next/link';

const partners = ['Toyota', 'Ford Việt Nam', 'Vietnam Airlines', 'Bosch', 'Siemens', 'Mitsubishi'];
const clients = [
  'Đại học Bách Khoa HN', 'Đại học Công nghiệp HN', 'Trường CĐ Nghề',
  'Tổng cục Dạy nghề', 'Sở Lao động TBXH', 'Trung tâm Đào tạo lái xe',
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
];

export default function PartnersSection() {
  return (
<<<<<<< HEAD
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
=======
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Partners */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Đối tác</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Một số đối tác tiêu biểu của chúng tôi</p>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((p) => (
              <div key={p}
                className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-primary-300 hover:text-primary-700 transition">
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Clients */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Khách hàng</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Một số khách hàng tiêu biểu của chúng tôi</p>
          <div className="flex flex-wrap justify-center gap-4">
            {clients.map((c) => (
              <div key={c}
                className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                {c}
              </div>
            ))}
          </div>
        </div>
>>>>>>> 240eea5fbb751649464404f57cb0f04f70f098f9
      </div>
    </section>
  );
}
