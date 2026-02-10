import Footer from '../components/Footer.jsx';
import Card from "../components/Card";
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchTypes } from '../app/Api.js';
import { Option } from 'lucide-react';

export default function ServicePage() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  console.log(type)
  const { data: types = [] } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarSwitcher />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-4 mb-10">
          <div className="flex items-center bg-white border rounded-lg px-3 w-full">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search for..."
              value={search}
              className="w-full py-2 outline-none"
              onChange={(e) => { setSearch(e.target.value) }}
            />
          </div>
        {/* do the same main page  */}
          <select className="border rounded-lg px-3 py-2 bg-white">
            <option hidden>{type}</option>
            {types.map((type) => (
              <option key={type.TypesID}>{type.TypesName}</option>
            ))
            }
          </select>
          <button className="bg-blue-600 text-white px-6 rounded-lg">
            Search
          </button>
        </div>
        <Card />
      </div>

      <Footer />
    </div>
  );
}

