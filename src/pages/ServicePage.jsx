import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchTypes, fetchfilterService } from '../app/Api.js';

export default function ServicePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";

  const { data: types = [] } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', type, keyword],
    queryFn: () => fetchfilterService(type, keyword),
  });

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {"★".repeat(full)}
        {half && "⭐"}
        {"☆".repeat(empty)}
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-blue-50 to-white">
      <NavbarSwitcher />

      <div className="max-w-7xl sm:mx-auto px-4 sm:px-6 py-6 sm:py-10 grow ">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ค้นหาบริการ</h1>
          <p className="text-gray-500 text-sm sm:text-base">เลือกบริการที่ปรึกษาที่ตรงใจคุณ</p>
        </header>
        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-10">

          <div className="flex flex-1 items-center bg-white border rounded-lg shadow-sm px-3 focus-within:ring-2 focus-within:ring-blue-400 transition-all hover:shadow-xl">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="ค้นหา..."
              value={keyword}
              className="w-full py-2 outline-none text-sm sm:text-base"
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("keyword", e.target.value);
                setSearchParams(newParams);
              }}
            />
          </div>

          <select
            value={type}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("type", e.target.value);
              setSearchParams(newParams);
            }}
            className="border rounded-lg px-4 py-2 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base w-full sm:w-48 cursor-pointer hover:shadow-xl"
          >
            <option value="">ทุกประเภท</option>
            {types.map((t) => (
              <option key={t.TypesID} value={t.TypesName}>
                {t.TypesName}
              </option>
            ))}
          </select>

        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services?.map((service) => (
            <div
              key={service.ServiceID}
              className="border rounded-lg shadow-xl p-3 sm:p-4 bg-gray-50 h-full hover:-translate-y-2 hover:shadow-2xl duration-300"

            >
              <Link
                to={`/detail/${service.ServiceID}`}
                className="flex flex-col h-full"
              >

                {/* Image */}
                <div className="relative w-full h-32 sm:h-40 bg-gray-200 rounded mb-3 sm:mb-4 overflow-hidden">
                  <div className="absolute top-2 right-2 z-10 bg-white/80 px-2 py-1 rounded shadow-sm">
                    <p className="text-[10px] sm:text-xs font-bold text-green-600">
                      #{service.TypesName}
                    </p>
                  </div>

                  {service.ImageURL ? (
                    <img
                      src={service.ImageURL}
                      alt={service.ServiceName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Profile + Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {service.imageAdvisorUrl ? (
                      <img
                        src={service.imageAdvisorUrl}
                        className="w-full h-full object-cover"
                        alt="profile"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-sm sm:text-base line-clamp-1">
                      {service.ServiceName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {service.Fadvisor} {service.Ladvisor}
                    </p>

                    <div className="flex items-center gap-2 text-yellow-500 text-xs">
                      {renderStars(service.AvgRating)}
                      <span className="text-gray-500">
                        {service.AvgRating}
                      </span>
                      <span className="text-gray-400">
                        ({service.ReviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 break-words">
                  {service.Front_Description}
                </p>

                {/* Bottom */}
                <div className="mt-auto text-xs text-gray-400 text-right pt-3 sm:pt-4">
                  <div>{service.price} บาท</div>
                  <div>{service.Duration} นาที</div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            ไม่พบบริการ
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}