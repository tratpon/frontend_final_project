import React from "react";
import NavbarSwitcher from "../app/NavbarSwitcht";
import Footer from "../components/Footer"; // มั่นใจว่าใช้เวอร์ชัน Mini/Compact
import { Target, Users, ShieldCheck, Zap, HeartHandshake } from "lucide-react";

export default function AboutUs() {
  const objectives = [
    { icon: <Zap size={24} />, text: "พัฒนาแพลตฟอร์มให้คำปรึกษาออนไลน์แบบครบวงจร" },
    { icon: <Users size={24} />, text: "รองรับการใช้งานทั้งระบบแชทและวิดีโอคอลคุณภาพสูง" },
    { icon: <ShieldCheck size={24} />, text: "ส่งเสริมการเข้าถึงบริการอย่างเท่าเทียมและเป็นส่วนตัว" },
    { icon: <Target size={24} />, text: "ลดข้อจำกัดด้านเวลาและค่าใช้จ่ายในการเดินทาง" },
    { icon: <HeartHandshake size={24} />, text: "เพิ่มโอกาสสร้างรายได้ให้ผู้เชี่ยวชาญในสาขาต่างๆ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarSwitcher />

      <main className="grow">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-16 sm:py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
              About <span className="text-blue-500">Us</span>
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
              เรามุ่งมั่นที่จะเป็นสะพานเชื่อมโยงความรู้และความช่วยเหลือ 
              เพื่อให้ทุกคนเข้าถึงคำปรึกษาที่มีคุณภาพได้ทุกที่ ทุกเวลา
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
              ความเป็นมาของโครงการ
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg">
              <p>
                ในยุคปัจจุบัน สังคมไทยเผชิญกับความท้าทายที่ซับซ้อนขึ้น ทั้งในด้าน
                <span className="text-slate-900 font-medium"> สุขภาพจิต ความสัมพันธ์ การเงิน และกฎหมาย</span> 
                ความต้องการที่ปรึกษาเฉพาะทางจึงเพิ่มสูงขึ้นอย่างต่อเนื่อง
              </p>
              <p>
                เราเล็งเห็นว่าผู้คนส่วนใหญ่ยังติดข้อจำกัดด้าน <span className="underline decoration-blue-500/30 underline-offset-4">ระยะทาง เวลา และความกังวลเรื่องความเป็นส่วนตัว</span> 
                แพลตฟอร์มนี้จึงถูกพัฒนาขึ้นเพื่อทลายกำแพงเหล่านั้น โดยรวมผู้เชี่ยวชาญจากหลากหลายสาขาไว้ในที่เดียว
              </p>
              <p className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 italic">
                "เป้าหมายสูงสุดของเราคือการยกระดับคุณภาพชีวิตของประชาชน 
                ผ่านการเข้าถึงความช่วยเหลือที่สะดวก ปลอดภัย และได้มาตรฐาน"
              </p>
            </div>
          </div>
        </section>

        {/* Objectives Grid */}
        <section className="bg-white py-16 px-6 border-y border-slate-100">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">วัตถุประสงค์</h2>
            <p className="text-slate-500">พันธกิจที่เราให้ความสำคัญเพื่อผู้ใช้งานทุกคน</p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((item, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-slate-100">
                <div className="text-blue-600 mb-4 bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm border border-slate-50">
                  {item.icon}
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Info */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-inner border-4 border-white">
              👨‍💻
            </div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Developed By</h2>
            <p className="text-2xl font-extrabold text-slate-800 mb-1">
              นายทัศน์พล แดงอร่าม
            </p>
            <p className="text-slate-400 text-sm">Computer Science & Software Engineer Student</p>
          </div>
        </section>
      </main>

      {/* Footer จะอยู่ล่างสุดเสมอเพราะ Parent เป็น flex-col และมี flex-grow ใน main */}
      <Footer />
    </div>
  );
}