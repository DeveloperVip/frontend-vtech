'use client';

import { useContactForm } from '@/hooks/useContactForm';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const { form, isLoading, isSuccess, onSubmit } = useContactForm();
  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="mb-4 text-5xl">✅</div>
        <h3 className="mb-3 text-2xl font-bold text-green-800">Gửi Tin Nhắn Thành Công!</h3>
        <p className="text-[15px] text-gray-600">
          Cảm ơn bạn đã liên hệ Vitechs. Chúng tôi sẽ sớm phản hồi bạn.
        </p>
      </motion.div>
    );
  }


  const inputClass = "w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-[14px] text-gray-800 placeholder-gray-400 focus:ring-0 focus:border-[#FF8A00] transition-colors rounded-none";
  const labelClass = "block text-[11px] font-extrabold text-gray-800 uppercase tracking-wider mb-1";
  const errorClass = "text-[11px] text-red-500 mt-1 block h-4";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col w-full gap-0">

      {/* Step 01 */}
      <div className="mb-8">
        <h3 className="text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-[#FF8A00]">01.</span> Thông Tin Liên Hệ
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label htmlFor="fullName" className={labelClass}>Họ và Tên</label>
            <input
              id="fullName"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              disabled={isLoading}
              className={`${inputClass} ${errors.fullName ? 'border-red-500' : ''}`}
              {...register('fullName')}
            />
            <span className={errorClass}>{errors.fullName?.message}</span>
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Số Điện Thoại</label>
            <input
              id="phone"
              type="tel"
              placeholder="0900 000 000"
              autoComplete="tel"
              disabled={isLoading}
              className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`}
              {...register('phone')}
            />
            <span className={errorClass}>{errors.phone?.message}</span>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              disabled={isLoading}
              className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
              {...register('email')}
            />
            <span className={errorClass}>{errors.email?.message}</span>
          </div>

          <div>
            <label htmlFor="subject" className={labelClass}>Tên Công Ty</label>
            <input
              id="subject"
              placeholder="Tên công ty / tổ chức"
              disabled={isLoading}
              className={`${inputClass} ${errors.subject ? 'border-red-500' : ''}`}
              {...register('subject')}
            />
            <span className={errorClass}>{errors.subject?.message}</span>
          </div>
        </div>
      </div>

      {/* Step 02 */}
      <div className="mb-8">
        <h3 className="text-[18px] font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-[#FF8A00]">02.</span> Để Lại Lời Nhắn
        </h3>

        <div>
          <textarea
            id="message"
            placeholder="Bạn cần chúng tôi hỗ trợ gì?"
            rows={2}
            disabled={isLoading}
            className={`${inputClass} resize-none min-h-[60px] ${errors.message ? 'border-red-500' : ''}`}
            {...register('message')}
          />
          <span className={errorClass}>{errors.message?.message}</span>
        </div>
      </div>

      {/* Step end */}
      <div className="mt-6">
        <p className="text-[11px] text-gray-500 leading-relaxed mb-6">
          Cảm ơn bạn đã liên hệ với Vitechs. Chúng tôi trân trọng sự quan tâm của bạn và sẽ phản hồi trong thời gian sớm nhất để giải đáp các thắc mắc và cung cấp thông tin chi tiết.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-black text-white font-bold text-[14px] px-10 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Gửi Đi'
          )}
        </motion.button>
      </div>
    </form>
  );
}
