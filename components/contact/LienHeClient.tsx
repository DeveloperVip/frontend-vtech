'use client';

import { useState, useEffect } from 'react';
import { submitContact } from '@/services/publicService';
import { CheckCircle2, Send, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContactsService } from '@/src/api/generated';

const infoCards = [
  {
    icon: Phone,
    title: 'Điện Thoại',
    lines: ['02466828899', 'Hotline: 02466828899'],
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['vitechs.jsc@gmail.com'],
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: MapPin,
    title: 'Địa Chỉ',
    lines: ['Số 1,Đường Giải Phóng', 'TP. Hà Nội, Việt Nam'],
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Clock,
    title: 'Giờ Làm Việc',
    lines: [' 8:00 - 20:00h hằng ngày'],
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

const whyUs = [
  {
    title: 'Sản Phẩm Chính Hãng',
    desc: '100% hàng chính hãng, có tem nhãn rõ ràng',
  },
  {
    title: 'Giá Cả Cạnh Tranh',
    desc: 'Cam kết giá tốt nhất thị trường',
  },
  {
    title: 'Tư Vấn Chuyên Nghiệp',
    desc: 'Đội ngũ tư vấn nhiệt tình, am hiểu sản phẩm',
  },
  {
    title: 'Bảo Hành Uy Tín',
    desc: 'Chế độ bảo hành rõ ràng, đổi trả dễ dàng',
  },
];
//vị trí map//
export default function LienHeClient() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.691874268182!2d105.83921437503072!3d21.00498498063841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac77502cc989%3A0x2b7fb89694342af8!2zMSDEkC4gR2nhuqNpIFBow7NuZywgxJDhu5NuZyBUw6JtLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1773572670494!5m2!1svi!2s";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.name = 'Vui lòng nhập họ tên';
    // const phoneTrimmed = form.phone.replace(/\s+/g, '');
    // if (!phoneTrimmed) {
    //   e.phone = 'Vui lòng nhập số điện thoại';
    // } else 
    if (form?.phone && !/^[0-9+() -]{10,}$/.test(form.phone.trim())) {
      e.phone = 'Số điện thoại không hợp lệ (ít nhất 10 số)';
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      e.email = 'Vui lòng nhập email hợp lệ';
    }
    // if (!form.subject.trim()) {
    //   e.subject = 'Tên sản phẩm muốn tư vấn';
    // }
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
      await ContactsService.postContacts({ ...form, phone: Number(form?.phone) });
      setSuccess(true);
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setErrors({ submit: 'Gửi thất bại, vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNameBlur = () => {
    if (!form.fullName.trim()) {
      setErrors(prev => ({ ...prev, name: 'Vui lòng nhập họ tên' }));
    } else {
      setErrors(prev => { const { name, ...rest } = prev; return rest; });
    }
  };

  const handleEmailBlur = () => {
    if (!form.email.trim() || !form.email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email hợp lệ' }));
    } else {
      setErrors(prev => { const { email, ...rest } = prev; return rest; });
    }
  };

  const handlePhoneBlur = () => {
    const phoneTrimmed = form.phone.replace(/\s+/g, '');
    if (!phoneTrimmed) {
      setErrors(prev => ({ ...prev, phone: 'Vui lòng nhập số điện thoại' }));
    } else if (!/^[0-9+() -]{10,}$/.test(form.phone.trim())) {
      setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ (ít nhất 10 số)' }));
    } else {
      setErrors(prev => { const { phone, ...rest } = prev; return rest; });
    }
  };

  const handleMessageBlur = () => {
    if (!form.message.trim()) {
      setErrors(prev => ({ ...prev, message: 'Vui lòng nhập nội dung' }));
    } else {
      setErrors(prev => { const { message, ...rest } = prev; return rest; });
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white";
  const labelCls = "block text-[13px] font-semibold text-gray-700 mb-1";
  const errCls = "text-[11px] text-red-500 mt-1 block";

  return (
    <div className="w-full bg-gray-50 min-h-screen">

      {/* Header Banner */}
      <div
        className="text-white pt-20 pb-16"
        style={{ background: 'linear-gradient(90deg,rgba(215, 247, 250, 1) 0%, rgba(69, 133, 230, 1) 0%, rgba(188, 160, 250, 1) 100%, rgba(124, 166, 230, 1) 82%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1440px] mx-auto px-2 md:px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-blue-100 text-base max-w-xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
          </p>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="max-w-[1440px] mx-auto px-2 md:px-4 -mt-10 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center gap-3 border border-gray-100"
            >
              <div className={`${card.bg} p-3 rounded-full`}>
                <card.icon className={card.color} size={22} />
              </div>
              <h3 className={`font-bold text-[15px] ${card.color}`}>{card.title}</h3>
              {card.lines.map(line => (
                <p key={line} className="text-gray-500 text-[13px] leading-snug">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-2 md:px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Gửi Thành Công!</h3>
                <p className="text-gray-500 text-sm mb-6">Chúng tôi sẽ liên hệ lại với bạn sớm nhất.</p>
                <button onClick={() => setSuccess(false)} className="text-sm text-blue-600 underline hover:no-underline">
                  Gửi yêu cầu khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelCls}>Họ và Tên *</label>
                  <input
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onBlur={handleNameBlur}
                    placeholder="Nhập họ và tên của bạn"
                    className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
                  />
                  {errors.name && <span className={errCls}>{errors.name}</span>}
                </div>

                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onBlur={handleEmailBlur}
                    placeholder="email@example.com"
                    className={`${inputCls} ${errors.email ? 'border-red-400' : ''}`}
                  />
                  {errors.email && <span className={errCls}>{errors.email}</span>}
                </div>

                <div>
                  <label className={labelCls}>Số Điện Thoại *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    onBlur={handlePhoneBlur}
                    placeholder="0123 456 789"
                    className={`${inputCls} ${errors.phone ? 'border-red-400' : ''}`}
                  />
                  {errors.phone && <span className={errCls}>{errors.phone}</span>}
                </div>
                <div>
                  <label className={labelCls}>Sản phẩm cần tư vấn</label>
                  <input
                    // type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    // onBlur={handlePhoneBlur}
                    placeholder="Nhập sản phẩm cần tư vấn"
                    className={`${inputCls}`}
                  />
                  {<span className={errCls}>{errors.subject}</span>}
                </div>
                <div>
                  <label className={labelCls}>Nội Dung *</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onBlur={handleMessageBlur}
                    placeholder="Nhập nội dung bạn muốn tư vấn..."
                    className={`${inputCls} resize-none ${errors.message ? 'border-red-400' : ''}`}
                  />
                  {errors.message && <span className={errCls}>{errors.message}</span>}
                </div>

                {errors.submit && <p className="text-red-500 text-xs">{errors.submit}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-bold text-[14px] px-8 py-3 rounded-xl transition-opacity disabled:opacity-50"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Send size={15} />
                  }
                  {loading ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Map và lí do */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tại Sao Chọn Chúng Tôi?</h2>
              <div className="space-y-5">
                {whyUs.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 text-[14px]">{item.title}</p>
                      <p className="text-gray-500 text-[13px]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex-1 min-h-[220px]"
            >
              <iframe
                src={MAP_URL}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '220px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ văn phòng Vitechs"
              />
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
}
