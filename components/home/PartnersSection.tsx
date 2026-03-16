import Link from 'next/link';

const partners = ['Toyota', 'Ford Việt Nam', 'Vietnam Airlines', 'Bosch', 'Siemens', 'Mitsubishi'];
const clients = [
  'Đại học Bách Khoa HN', 'Đại học Công nghiệp HN', 'Trường CĐ Nghề',
  'Tổng cục Dạy nghề', 'Sở Lao động TBXH', 'Trung tâm Đào tạo lái xe',
];

export default function PartnersSection() {
  return (
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
      </div>
    </section>
  );
}
