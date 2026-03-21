'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Users, UserCheck, Settings, Briefcase, Calculator, PenTool, Wrench } from 'lucide-react';

const orgData = [
  {
    title: 'Hội Đồng Quản Trị',
    role: 'Ban lãnh đạo cao nhất, định hướng chiến lược và quyết định các kế hoạch quan trọng của công ty.',
    icon: Users,
    color: 'bg-blue-900',
  },
  {
    title: 'Giám Đốc',
    role: 'Người đứng đầu điều hành quản lý, đại diện pháp luật và lập kế hoạch tổng thể cho doanh nghiệp.',
    icon: UserCheck,
    color: 'bg-blue-700',
  },
  {
    subtitle: [
      {
        title: 'Phó Giám Đốc Kinh Doanh',
        role: 'Trực tiếp phụ trách kinh doanh, tổ chức lập kế hoạch tiếp nhận dự án và chịu trách nhiệm sản xuất.',
        icon: Briefcase,
        color: 'bg-blue-600',
        departments: ['Phòng Kinh Doanh']
      },
      {
        title: 'Phòng Kỹ Thuật - Sản Xuất',
        role: 'Đảm bảo máy móc thiết bị, thiết kế bản vẽ, tổ chức sản xuất và đào tạo nguồn nhân lực tay nghề cao.',
        icon: Settings,
        color: 'bg-indigo-600',
        center: true
      },
      {
        title: 'Phó Giám Đốc Kỹ Thuật',
        role: 'Phê duyệt bản vẽ, chịu trách nhiệm về chất lượng sản phẩm và quản lý các công trình kỹ thuật.',
        icon: PenTool,
        color: 'bg-blue-600',
        departments: ['Phòng Kế Toán - Hành Chính']
      }
    ]
  }
];

const technicalDetails = [
  { title: 'Tư vấn kỹ thuật', icon: Users },
  { title: 'Bộ phận sản xuất', icon: Settings },
  { title: 'Lắp đặt & Chuyển giao', icon: Wrench },
  { title: 'Bảo hành & Bảo trì', icon: Calculator },
];

export default function AboutOrgChart() {
  return (
    <div className="max-w-[1440px] mx-auto px-2 md:px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-8 uppercase tracking-wider">Sơ Đồ Tổ Chức</h2>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
        <p className="max-w-3xl mx-auto text-[#666] font-medium text-[15px] leading-relaxed italic">
          Cơ cấu tổ chức chuyên nghiệp, tinh gọn giúp Vitechs vận hành hiệu quả và mang lại giá trị cao nhất cho khách hàng.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-12 mb-24">
        {/* Tier 1 & 2 */}
        {orgData.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`${item.color} text-white p-8 rounded-[32px] shadow-2xl shadow-blue-900/10 min-w-[280px] text-center relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              {item.icon && <item.icon size={32} className="mx-auto mb-4 opacity-90" />}
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2">{item.title}</h3>
              <p className="text-[12px] opacity-80 font-medium leading-relaxed max-w-[240px] mx-auto">{item.role}</p>
            </motion.div>
            {idx === 0 && (
              <div className="h-12 w-0.5 bg-blue-200" />
            )}
            {idx === 1 && (
              <div className="h-12 w-0.5 bg-blue-200 relative">
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-4xl h-0.5 bg-blue-200" />
              </div>
            )}
          </div>
        ))}

        {/* Tier 3: PGĐs and Middle Dept */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-[1440px] relative">
          {(orgData[2].subtitle as any).map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="h-8 w-0.5 bg-blue-200 hidden md:block" />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`${item.center ? 'bg-indigo-900 shadow-indigo-900/10' : 'bg-white text-blue-900 shadow-blue-900/5 border border-blue-50'} p-8 rounded-[32px] shadow-2xl w-full text-center relative group hover:shadow-blue-900/10 transition-shadow duration-500`}
              >
                <div className={`${item.center ? 'text-white' : 'text-blue-600'} mb-4 flex justify-center`}>
                  {item.icon && <item.icon size={32} strokeWidth={1.5} />}
                </div>
                <h4 className={`text-lg font-bold mb-3 uppercase tracking-wide ${item.center ? 'text-white' : 'text-blue-900'}`}>{item.title}</h4>
                <p className={`text-[12px] leading-relaxed font-medium mb-4 ${item.center ? 'text-white/80' : 'text-[#666]'}`}>
                  {item.role}
                </p>
                {item.departments && (
                   <div className="flex justify-center gap-2 mt-auto">
                     {item.departments.map((dept: string, dIdx: number) => (
                       <span key={dIdx} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-tighter">
                         {dept}
                       </span>
                     ))}
                   </div>
                )}
              </motion.div>
              
              {item.center && (
                <div className="h-12 w-0.5 bg-blue-200" />
              )}
            </div>
          ))}
        </div>

        {/* Technical Sub-departments with Connections - Tier 4 */}
        <div className="w-full max-w-[1440px] relative mt-0">
           {/* Horizontal Branching Line - Top-most part */}
           <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[88%] h-0.5 bg-blue-200" />

           {/* Vertical connections and cards shifted down even more for a clearer 'disconnected' look */}
           <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-8"
           >
              {technicalDetails.map((dept, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Separate vertical segment for each card - with a clearly larger gap now */}
                  <div className="h-16 w-0.5 bg-blue-200 hidden md:block" />
                  <div className="bg-blue-50/40 p-6 rounded-[24px] border border-blue-100 flex flex-col items-center text-center w-full shadow-sm">
                     {dept.icon && <dept.icon size={24} className="text-blue-600 mb-3" strokeWidth={1.5} />}
                     <p className="text-[12px] font-extrabold text-[#111] uppercase tracking-tight leading-tight">{dept.title}</p>
                  </div>
                </div>
              ))}
           </motion.div>
        </div>
      </div>
    </div>
  );
}
