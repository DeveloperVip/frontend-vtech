import Link from 'next/link';

const goals = [
  'Tiếp tục phát triển, giữ vững vị thế là một trong những doanh nghiệp hàng đầu Việt Nam về lĩnh vực cung cấp thiết bị đào tạo, thiết bị dạy nghề.',
  'Cung cấp những mặt hàng thương mại có chất lượng cao nhất, đáp ứng tốt với yêu cầu của khách hàng, tạo niềm tin vững chắc nơi khách hàng.',
  'Đào tạo và phát triển đội ngũ nhân lực có trình độ cao, chuyên môn sâu trong từng lĩnh vực, nhiệt huyết và tận tâm phục vụ khách hàng.',
];

export default function GoalSection() {
  return (
    <section className="py-20 bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Mục tiêu</h2>
          <ul className="flex flex-col gap-4">
            {goals.map((g, i) => (
              <li key={i} className="flex items-start gap-3 text-primary-100 text-sm leading-relaxed">
                <span className="mt-1 w-5 h-5 rounded-full bg-white/20 text-white text-xs flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </span>
                {g}
              </li>
            ))}
          </ul>
          <Link href="/lien-he"
            className="inline-block mt-8 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Kết nối với Vitechs
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Ngành Cơ khí', emoji: '⚙️' },
            { label: 'Ngành Điện – Điện tử', emoji: '⚡' },
            { label: 'Công nghệ ô tô', emoji: '🚗' },
            { label: 'Điện lạnh', emoji: '❄️' },
          ].map((item) => (
            <div key={item.label}
              className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/20 transition cursor-default">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
