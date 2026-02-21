import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchTypes, fetchfilterService } from '../app/Api.js';
import { Option } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
export default function ServicePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";

  const { data: types = [] } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });

  // const { data: { services = [] } = {} } = useQuery({
  //   queryKey: ['services'],
  //   queryFn: fetchAllService,
  //   refetchInterval: 5000,
  // });


  const { data: services = []  } = useQuery({
    queryKey: ['services', type, keyword],
    queryFn: () => fetchfilterService(type, keyword),
  });

  console.log(services, type, keyword)
 

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarSwitcher />

      <div className="max-w-8xl mx-80 px-6 py-10 grow">
        <div className="flex gap-4 mb-10">
          <div className="flex items-center bg-white border rounded-lg px-3 w-full">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search for..."
              value={keyword}
              className="w-full py-2 outline-none"
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set("keyword", e.target.value);
                setSearchParams(newParams);
              }}
            />
          </div>
          {/* do the same main page  */}
          <select value={type}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set("type", e.target.value);
              setSearchParams(newParams);
            }} className="border rounded-lg px-3 py-2 bg-white">
            {types.map((type) => (
              <option key={type.TypesID}>{type.TypesName}</option>
            ))
            }
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link to={`/detail/${service.ServiceID}`} key={service.ServiceID} className="bg-white border rounded-lg p-4">
              <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <h3 className="font-medium">{service.ServiceName}</h3>
                  <p className="text-sm text-gray-500">{service.ServiceName}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600">{service.Front_Description}</p>

              <div className="text-xs text-gray-400 text-right mt-4">
                #### xxxx
              </div>
            </Link>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
}

