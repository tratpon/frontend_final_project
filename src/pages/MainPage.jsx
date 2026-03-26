import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTypes } from '../app/Api.js';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';



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
    <div className="min-h-screen flex flex-col">
      <NavbarSwitcher />
      <section className=" flex-1 flex flex-col items-center justify-center px-4 bg-linear-to-b from-blue-50 to-white py-20">
        
        {/* Welcome Text Area */}
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            ค้นหาคำปรึกษาที่ <span className="text-blue-600">ใช่สำหรับคุณ</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ไม่ว่าจะเป็นเรื่องสุขภาพจิต การทำงาน หรือการเงิน เรามีผู้เชี่ยวชาญพร้อมดูแลคุณ
          </p>
        </div>

        {/* Improved Search Bar Design */}
        <div className="w-full max-w-3xl bg-white p-2 rounded-2xl md:rounded-full shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-2 transition-all hover:shadow-2xl">
          
          {/* Input Group */}
          <div className="flex flex-1 items-center w-full px-4 border-b md:border-b-0 md:border-r border-gray-100">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              className="w-full py-4 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              placeholder="ค้นหาบริการหรือผู้ให้คำปรึกษา..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Select Group */}
          <div className="w-full md:w-auto px-4 border-b md:border-b-0 md:border-r border-gray-100">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full py-4 bg-transparent outline-none text-gray-600 font-medium cursor-pointer"
            >
              {types.map((t) => (
                <option key={t.TypesID} value={t.TypesName}>
                  {t.TypesName}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl md:rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
          >
            ค้นหา
          </button>
        </div>

       
      </section>
      <Footer />
    </div>
  );
}

