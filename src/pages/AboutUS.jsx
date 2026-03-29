import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">เกี่ยวกับเรา</h1>
        <p className="text-gray-500 mt-2 max-w-xl">
          เราให้บริการคำปรึกษาออนไลน์แบบมืออาชีพ เพื่อช่วยคุณแก้ไขปัญหาและพัฒนาตัวเองอย่างยั่งยืน
        </p>
      </div>

      {/* Mission / Vision */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">พันธกิจของเรา</h2>
          <p className="text-gray-600">
            ให้คำปรึกษาที่มีคุณภาพและสร้างผลลัพธ์จริงสำหรับผู้ใช้บริการทุกคน พร้อมสนับสนุนการเติบโตและพัฒนาตนเอง
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">วิสัยทัศน์ของเรา</h2>
          <p className="text-gray-600">
            เป็นแพลตฟอร์มคำปรึกษาออนไลน์ชั้นนำ ที่ผู้คนทั่วประเทศไว้วางใจในด้านคุณภาพและความเชี่ยวชาญของเรา
          </p>
        </div>
      </div>

      {/* Team Members */}
      <div className="w-full max-w-5xl mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ทีมงานของเรา</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: "สมชาย ใจดี", role: "ผู้ให้คำปรึกษาหลัก", img: "https://via.placeholder.com/150" },
            { name: "สายฝน สวัสดิ์", role: "ผู้ให้คำปรึกษาเฉพาะทาง", img: "https://via.placeholder.com/150" },
            { name: "นที พัฒนชัย", role: "นักพัฒนา", img: "https://via.placeholder.com/150" },
            { name: "พรทิพย์ อ่อนโยน", role: "ออกแบบ UX/UI", img: "https://via.placeholder.com/150" },
          ].map((member, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-md text-center">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values / Principles */}
      <div className="w-full max-w-5xl mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">ค่านิยมของเรา</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { title: "ซื่อสัตย์", desc: "ให้คำปรึกษาอย่างโปร่งใสและตรงไปตรงมา" },
            { title: "มืออาชีพ", desc: "เรามีความเชี่ยวชาญและประสบการณ์สูง" },
            { title: "ใส่ใจลูกค้า", desc: "เข้าใจและตอบสนองความต้องการของผู้ใช้บริการ" },
            { title: "พัฒนาอย่างต่อเนื่อง", desc: "ปรับปรุงบริการและความรู้เพื่อคุณภาพที่ดีที่สุด" },
          ].map((val, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-md">
              <h4 className="font-semibold text-gray-800 mb-2">{val.title}</h4>
              <p className="text-gray-500 text-sm">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-400 text-sm">© 2026 บริการคำปรึกษาออนไลน์. สงวนลิขสิทธิ์.</p>
    </div>
  );
}