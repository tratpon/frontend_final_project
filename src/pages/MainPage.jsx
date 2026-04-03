import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTypes } from '../app/Api.js';
import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';



export default function Mainpage() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const { data: types = [] } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (types.length > 0) {
      setType(types[0].TypesName);
    }
  }, [types]);;

  const handleSearch = () => {
    navigate(`/service?keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}`);
  };

  return (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <NavbarSwitcher />
    
    <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor - เพิ่มลูกเล่นพื้นหลัง */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px] opacity-50" />
      </div>

      <section className="w-full max-w-5xl py-20 flex flex-col items-center">
        {/* Headline Section */}
        <div className="text-center mb-12 space-y-4">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-100">
            Expert Consulting Platform
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            ค้นหาคำปรึกษาที่ <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ใช่สำหรับคุณ
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            เชื่อมต่อกับผู้เชี่ยวชาญระดับมืออาชีพ พร้อมดูแลคุณทุกย่างก้าว
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md p-3 rounded-3xl md:rounded-full shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-white flex flex-col md:flex-row items-center gap-2 ring-1 ring-black/5">
          
          {/* Input: Keyword */}
          <div className="flex-[1.5] flex items-center w-full px-5 group">
            <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
            <input
              className="w-full py-4 px-3 bg-transparent outline-none text-slate-700 placeholder-slate-400 font-medium"
              placeholder="ค้นหาบริการหรือชื่อผู้เชี่ยวชาญ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {keyword && (
              <button onClick={() => setKeyword("")} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>

          {/* Divider (Desktop Only) */}
          <div className="hidden md:block h-8 w-[1px] bg-slate-200" />

          {/* Select: Type */}
          <div className="flex-1 w-full px-5 flex items-center relative group">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full py-4 bg-transparent outline-none text-slate-600 font-semibold cursor-pointer appearance-none"
            >
              {types.length === 0 ? (
                <option>กำลังโหลดประเภท...</option>
              ) : (
                types.map((t) => (
                  <option key={t.TypesID} value={t.TypesName}>{t.TypesName}</option>
                ))
              )}
            </select>
            <ChevronDown size={18} className="absolute right-6 text-slate-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl md:rounded-full transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_25px_rgba(37,99,235,0.3)] active:scale-95"
          >
            ค้นหาเลย
          </button>
        </div>

        {/* Quick Tags (Optional) - เพิ่มเพื่อให้หน้าดูไม่ว่างเกินไป */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="text-sm text-slate-400">ยอดนิยม:</span>
          {['ปรึกษาภาษี', 'วางแผนการเงิน', 'จิตวิทยาเด็ก'].map(tag => (
            <button key={tag} className="text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
              #{tag}
            </button>
          ))}
        </div>
      </section>
    </main>
    
    <Footer />
  </div>
);
}

