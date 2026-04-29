'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

const SCROLL_SPEED = 100;
const DRAG_ELASTIC = 0.02;
const DRAG_MOMENTUM = false;

const partnerLogos = [
  { name: 'Kistler-Đức', src: '/logo/Kistler-Đức.svg' },
  { name: 'Atech Training – Mỹ', src: '/logo/Atech Training – Mỹ .svg' },
  { name: 'ETS DIDACTIC MGBH – Đức', src: '/logo/ETS DIDACTIC MGBH – Đức.svg' },
  { name: 'DAC WORLDWIDE – Đức', src: '/logo/DAC WORLDWIDE –Đức.svg' },
  { name: 'Edibon – Tây Ban Nha', src: '/logo/Edibon – Tây Ban Nha .svg' },
  { name: 'Famic Technologies – Canada', src: '/logo/Famic Technologies – Canada.svg' },
  { name: 'YES01 – Hàn Quốc', src: '/logo/YES01 – Hàn Quốc .svg' },
  { name: 'Woodward – Mỹ', src: '/logo/Woodward – Mỹ.svg' },
  { name: 'CHIEF – Mỹ', src: '/logo/CHIEF – Mỹ.svg' },
  { name: 'Bosch – Đức', src: '/logo/Bosch – Đức.svg' },
  { name: 'SIEMENS – Đức', src: '/logo/SIEMENS – Đức.svg' },
  { name: 'Misubishi – Electric – Nhật Bản', src: '/logo/Misubishi – Electric – Nhật Bản.svg' },
  { name: 'HIOKI E.E CORPORATION – Nhật Bản', src: '/logo/HIOKI E.E CORPORATION – Nhật Bản.svg' },
  { name: 'AW Dynamometer – Đức', src: '/logo/AW Dynamometer – Đức .svg' },
  { name: 'Volkswagen AG', src: '/logo/Volkswagen AG.svg' },
  { name: 'Koeng Co.,Ltd – Hàn Quốc', src: '/logo/Koeng Co.,Ltd – Hàn Quốc.svg' },
  { name: 'Cardiv Co.,Ltd – Hàn Quốc', src: '/logo/Cardiv Co.,Ltd – Hàn Quốc.svg' },
  { name: 'VAMAG - Italy', src: '/logo/VAMAG -  Italy.svg' },
  { name: 'Ronin tools – Hà Lan', src: '/logo/Ronin tools – Hà Lan.svg' },
  { name: 'FI.TIM – Italy', src: '/logo/FI.TIM – Italy.svg' },
  { name: 'Teco Automotive Quipment – Italy', src: '/logo/Teco Automotive Quipment – Italy.svg' },
  { name: 'FAM SRL – Italy', src: '/logo/FAM SRL – Italy.svg' },
  { name: 'MAHLE Aftermarket - Italy', src: '/logo/MAHLE Aftermarket - Italy.svg' },
  { name: 'Mitutoyo – Nhật Bản', src: '/logo/Mitutoyo – Nhật Bản.svg' },
];

export default function PartnersSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [loopWidth, setLoopWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const normalizeX = (value: number, width: number) => {
    if (!width) return value;
    let next = value % width;
    if (next > 0) next -= width;
    return next;
  };

  useEffect(() => {
    const updateWidth = () => {
      const totalWidth = trackRef.current?.scrollWidth || 0;
      const nextLoopWidth = totalWidth / 2;
      setLoopWidth(nextLoopWidth);
      x.set(normalizeX(x.get(), nextLoopWidth));
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [x]);

  useAnimationFrame((_, delta) => {
    if (!loopWidth || isHovering || isDragging) return;

    const next = x.get() - (SCROLL_SPEED * delta) / 1000;
    x.set(next <= -loopWidth ? next + loopWidth : next);
  });

  return (
    <section className="py-24 bg-white pt-10">
      <h2 className="text-2xl md:text-3xl lg:text-[35px] font-black text-black leading-[1.1] uppercase tracking-tight text-center pb-10">Đối tác của chúng tôi</h2>
      <div
        className="overflow-hidden w-full relative mb-20"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsDragging(false);
        }}
      >
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <motion.div
          ref={trackRef}
          className="flex gap-28 items-center w-max cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -loopWidth, right: 0 }}
          dragElastic={DRAG_ELASTIC}
          dragMomentum={DRAG_MOMENTUM}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setIsDragging(false);
            x.set(normalizeX(x.get(), loopWidth));
          }}
        >
          {[...partnerLogos, ...partnerLogos].map((logo, index) => (
            <div
              key={index}
              className="group relative w-[180px] h-20 flex justify-center items-center shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              />

              {/* Tooltip */}
              <div
                className={`
                  pointer-events-none
                  absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                  whitespace-nowrap
                  rounded-md bg-black/90 px-2.5 py-1 text-[11px] font-medium text-white
                  transition-all duration-200 ease-out
                  ${!isDragging ? "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0" : "opacity-0"}
                  z-20
                `}
              >
                {logo.name}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1440px] mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-[#1e3a8a] leading-[1.1] uppercase tracking-tight">
              Lời cảm ơn gửi đến <br className="hidden md:block" /> đối tác và khách hàng
            </h2>
          </div>

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
