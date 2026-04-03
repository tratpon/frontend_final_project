import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchTypes, fetchfilterService } from '../app/Api.js';
import { Search, Filter, Clock, CircleDollarSign, Star } from 'lucide-react'; // แนะนำให้ลง lucide-react

export default function ServicePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";

  const { data: types = [] } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    refetchInterval: 1000 * 60 * 5,
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', type, keyword],
    queryFn: () => fetchfilterService(type, keyword),
  });

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        <Star size={14} fill="currentColor" />
        <span className="text-sm font-bold text-gray-700">{Number(rating).toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarSwitcher />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grow w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ค้นหาบริการปรึกษา
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              เลือกที่ปรึกษาที่เชี่ยวชาญเพื่อช่วยคุณหาทางออกที่ดีที่สุด
            </p>
          </div>
          
          {/* Clear Filter Button */}
          {(keyword || type) && (
            <button 
              onClick={() => setSearchParams({})}
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              ล้างการค้นหาทั้งหมด
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาชื่อบริการหรือที่ปรึกษา..."
              value={keyword}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => updateParams("keyword", e.target.value)}
            />
          </div>

          <div className="relative flex items-center min-w-[200px]">
            <Filter className="absolute left-4 text-slate-400" size={18} />
            <select
              value={type}
              onChange={(e) => updateParams("type", e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 appearance-none outline-none cursor-pointer"
            >
              <option value="">ทุกหมวดหมู่</option>
              {types.map((t) => (
                <option key={t.TypesID} value={t.TypesName}>{t.TypesName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {services?.map((service) => (
              <Link
                key={service.ServiceID}
                to={`/detail/${service.ServiceID}`}
                className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Image Wrap */}
                <div className="relative h-44 overflow-hidden">
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold text-blue-600 shadow-sm">
                      {service.TypesName}
                    </span>
                  </div>
                  {service.ImageURL ? (
                    <img
                      src={service.ImageURL}
                      alt={service.ServiceName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-medium">No Image</div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col grow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-100 shrink-0">
                      {service.imageAdvisorUrl ? (
                        <img src={service.imageAdvisorUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {service.ServiceName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        โดย {service.Fadvisor} {service.Ladvisor}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(service.AvgRating)}
                    <span className="text-xs text-slate-400">({service.ReviewCount} รีวิว)</span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {service.Front_Description}
                  </p>

                  {/* Price & Duration */}
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <Clock size={14} />
                      {service.Duration} นาที
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <span className="text-lg font-bold">{Number(service.price).toLocaleString()} ฿</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && services.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-5xl mb-4 text-slate-300">🔍</div>
            <h3 className="text-xl font-bold text-slate-800">ไม่พบบริการที่ท่านค้นหา</h3>
            <p className="text-slate-500 mt-2">กรุณาลองเปลี่ยนคำค้นหาหรือหมวดหมู่ใหม่อีกครั้ง</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}