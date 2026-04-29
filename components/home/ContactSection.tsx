'use client';

import { useEffect, useRef, useState } from 'react';
import { submitContact } from '@/services/publicService';
import { CheckCircle2 } from 'lucide-react';
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

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    const phoneTrimmed = form.phone.replace(/\s+/g, '');
    if (!phoneTrimmed) {
      e.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9+() -]{10,}$/.test(form.phone.trim())) {
      e.phone = 'Số điện thoại không hợp lệ (ít nhất 10 số)';
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      e.email = 'Vui lòng nhập email hợp lệ';
    }
    if (!form.message.trim()) e.message = 'Vui lòng nhập nội dung';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    setErrors({});
    setLoading(true);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setErrors({ submit: 'Gửi thất bại, vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNameBlur = () => {
    if (!form.name.trim()) setErrors(prev => ({ ...prev, name: 'Vui lòng nhập họ tên' }));
    else setErrors(prev => { const { name, ...rest } = prev; return rest; });
  };

  const handleEmailBlur = () => {
    if (!form.email.trim() || !form.email.includes('@')) setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email hợp lệ' }));
    else setErrors(prev => { const { email, ...rest } = prev; return rest; });
  };

  const handlePhoneBlur = () => {
    const phoneTrimmed = form.phone.replace(/\s+/g, '');
    if (!phoneTrimmed) setErrors(prev => ({ ...prev, phone: 'Vui lòng nhập số điện thoại' }));
    else if (!/^[0-9+() -]{10,}$/.test(form.phone.trim())) setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ (ít nhất 10 số)' }));
    else setErrors(prev => { const { phone, ...rest } = prev; return rest; });
  };

  const handleMessageBlur = () => {
    if (!form.message.trim()) setErrors(prev => ({ ...prev, message: 'Vui lòng nhập nội dung' }));
    else setErrors(prev => { const { message, ...rest } = prev; return rest; });
  };

  const inputCls = "w-full border-0 border-b border-gray-300 px-0 py-2.5 bg-transparent text-[13px] text-gray-900 focus:ring-0 focus:border-b-2 focus:border-blue-700 outline-none transition-all placeholder-gray-400";
  const labelCls = "block text-[12px] font-extrabold text-gray-900 mb-1";
  const errCls = "text-[11px] text-red-500 mt-1.5 block font-semibold";

  return (
    <section className="bg-white py-20 px-4 pb-0">
      <div className="max-w-[1440px] mx-auto px-2 md:px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 animate-fade-in-up">

        <div className="flex flex-col">
          {/* <h2 className="text-3xl md:text-[34px] font-extrabold text-blue-900 mb-6 tracking-tight uppercase">
            Hợp tác cùng Vitechs
          </h2>
          <p className="text-gray-600 text-[14px] mb-12 leading-relaxed font-medium">
            Nâng tầm doanh nghiệp của bạn với các giải pháp công nghệ tiên tiến. Hãy để Vitechs đồng hành cùng bạn trên chặng đường chinh phục thành công!
          </p> */}
          <div className="mt-auto rounded-xl overflow-hidden shadow-lg h-full w-full relative">
            {/* ảnh */}
            <img
              src="/logo/Artboard 3.png"
              alt="Hợp tác Vitechs"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 h-full pt-2">
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0 mt-0.5 fill-blue-50" />
              <p className="text-[14px] font-extrabold text-gray-900 tracking-tight">Nhận bản demo giải pháp thiết bị miễn phí.</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0 mt-0.5 fill-blue-50" />
              <p className="text-[14px] font-extrabold text-gray-900 tracking-tight">Nhận tư vấn trực tiếp từ các chuyên gia hàng đầu.</p>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0 mt-0.5 fill-blue-50" />
              <p className="text-[14px] font-extrabold text-gray-900 tracking-tight">Truy cập tài nguyên và tài liệu kỹ thuật miễn phí.</p>
            </div>
          </div>

          {success ? (
            <div className="bg-blue-50 p-10 rounded-2xl text-center border border-blue-100 flex-1 flex flex-col justify-center items-center">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-3">Gửi Thành Công!</h3>
              <p className="text-gray-600 mb-8 max-w-sm text-sm">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ sớm phản hồi yêu cầu của bạn.</p>
              <button onClick={() => setSuccess(false)} className="px-10 py-3 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition">
                Gửi phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              {/* Step 01 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                  <span className="text-blue-500 text-2xl font-black">01.</span> Thông Tin Liên Hệ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div>
                    <label className={labelCls}>Họ Tên *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} onBlur={handleNameBlur} className={`${inputCls} ${errors.name ? '!border-red-400' : ''}`} placeholder="Nhập họ và tên" />
                    {errors.name && <span className={errCls}>{errors.name}</span>}
                  </div>
                  <div>
                    <label className={labelCls}>Số Điện Thoại *</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} onBlur={handlePhoneBlur} className={`${inputCls} ${errors.phone ? '!border-red-400' : ''}`} placeholder="012-345-6789" />
                    {errors.phone && <span className={errCls}>{errors.phone}</span>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onBlur={handleEmailBlur} className={`${inputCls} ${errors.email ? '!border-red-400' : ''}`} placeholder="email@gmail.com" />
                    {errors.email && <span className={errCls}>{errors.email}</span>}
                  </div>
                </div>
              </div>

              {/* Step 02 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                  <span className="text-blue-500 text-2xl font-black">02.</span> Vui Lòng Để Lại Lời Nhắn
                </h3>
                <div>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} onBlur={handleMessageBlur} className={`${inputCls} resize-none ${errors.message ? '!border-red-400' : ''}`} rows={2} placeholder="Nội dung lời nhắn..." />
                  {errors.message && <span className={errCls}>{errors.message}</span>}
                </div>
              </div>

              <div className="text-[11px] text-gray-500 leading-relaxed -mt-4 text-justify">
                Cảm ơn bạn đã liên hệ Vitechs. Chúng tôi trân trọng sự quan tâm của bạn và sẽ phản hồi trong thời gian sớm nhất để giải đáp các thắc mắc và cung cấp thông tin chi tiết.
              </div>

              {errors.submit && <p className="-mt-8 text-red-500 text-[12px] font-semibold">{errors.submit}</p>}

              <button
                type="submit"
                disabled={loading}
                className="navbar-cta-heart self-start px-14 py-3 bg-blue-700 text-white hover:bg-blue-800 font-extrabold rounded-full transition-colors disabled:opacity-50 text-[13px] tracking-wide mt-2"
              >
                {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'}
              </button>
            </form>
          )}

        </div>
      </div>
      <section id="doi-tac" className="px-2 md:px-4 py-20 pb-0">
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
      </section>
    </section>
  );
}
