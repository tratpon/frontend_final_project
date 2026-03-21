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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarSwitcher />

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grow">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-10">

          {/* Search */}
          <div className="flex items-center bg-white border rounded-lg px-3 w-full">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search for..."
              value={keyword}
              className="w-full py-2 outline-none text-sm sm:text-base"
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("keyword", e.target.value);
                setSearchParams(newParams);
              }}
            />
          </div>

          {/* Filter */}
          <select
            value={type}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("type", e.target.value);
              setSearchParams(newParams);
            }}
            className="border rounded-lg px-3 py-2 bg-white w-full sm:w-auto text-sm sm:text-base"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t.TypesID} value={t.TypesName}>
                {t.TypesName}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services?.map((service) => (
            <div
              key={service.ServiceID}
              className="border p-3 sm:p-4 rounded bg-gray-50 h-full"
            >
              <Link
                to={`/detail/${service.ServiceID}`}
                className="flex flex-col h-full"
              >
                {/* Image */}
                <div className="w-full h-32 sm:h-40 bg-gray-200 rounded mb-3 sm:mb-4 overflow-hidden">

                  {service.ImageURL ? (
                    <img
                      src={service.ImageURL}
                      alt={service.ServiceName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    ""
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
                      {service.Fadvisor} {service.Ladvisor} ({service.TypesName})
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
            No services found
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}