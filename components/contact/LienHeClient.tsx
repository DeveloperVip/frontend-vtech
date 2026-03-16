'use client';

import { useState } from 'react';
import { submitContact } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function LienHeClient() {
  const config = siteConfig;
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) e.email = 'Vui lòng nhập email';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
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
    } catch {
      setErrors({ submit: 'Gửi thất bại, vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Thông tin liên hệ */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {config.about_description || 'Liên hệ với chúng tôi để được tư vấn miễn phí về các giải pháp công nghệ phù hợp.'}
        </p>
        <div className="space-y-5">
          {config.contact_phone && (
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Điện thoại</p>
                <a href={`tel:${config.contact_phone}`} className="font-semibold text-gray-800 hover:text-primary-700 transition-colors">
                  {config.contact_phone}
                </a>
              </div>
            </div>
          )}
          {config.contact_email && (
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                <a href={`mailto:${config.contact_email}`} className="font-semibold text-gray-800 hover:text-primary-700 transition-colors">
                  {config.contact_email}
                </a>
              </div>
            </div>
          )}
          {config.contact_address && (
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Địa chỉ</p>
                <p className="font-semibold text-gray-800">{config.contact_address}</p>
              </div>
            </div>
          )}
        </div>

        {config.contact_map_embed && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 h-56">
            <iframe
              src={config.contact_map_embed}
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        {success ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <CheckCircle2 size={56} className="text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Gửi thành công!</h3>
            <p className="text-gray-500 text-sm">Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
            <button onClick={() => setSuccess(false)}
              className="mt-6 text-sm text-primary-700 underline hover:no-underline">
              Gửi yêu cầu khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Gửi tin nhắn</h2>
            {errors.submit && (
              <p className="text-primary-600 text-sm bg-primary-50 px-3 py-2 rounded-lg">{errors.submit}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Họ và tên *</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition
                    ${errors.name ? 'border-primary-400 bg-primary-50' : 'border-gray-200 focus:border-primary-400'}`}
                />
                {errors.name && <p className="text-primary-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email *</label>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition
                    ${errors.email ? 'border-primary-400 bg-primary-50' : 'border-gray-200 focus:border-primary-400'}`}
                />
                {errors.email && <p className="text-primary-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Số điện thoại</label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="0901 234 567"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tiêu đề</label>
                <input
                  type="text" value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Yêu cầu tư vấn"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 text-sm outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Nội dung *</label>
              <textarea
                rows={5} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Mô tả yêu cầu của bạn..."
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition resize-none
                  ${errors.message ? 'border-primary-400 bg-primary-50' : 'border-gray-200 focus:border-primary-400'}`}
              />
              {errors.message && <p className="text-primary-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send size={16} />
              )}
              {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
