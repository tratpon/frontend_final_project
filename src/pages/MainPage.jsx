import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTypes } from '../app/Api.js';
import { useState, useEffect } from 'react';



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


  return (
    <div className="min-h-screen flex flex-col">
      <NavbarSwitcher />
      <section className="min-h-screen bg-gray-200 py-20 flex flex-col items-center justify-center text-center px-4">

        {/* Welcome Text */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-8">
          welcome
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-1/2 bg-white border rounded shadow-sm overflow-hidden">

          {/* Input */}
          <div className="flex items-center px-3 text-gray-400">
            🔍
          </div>

          <input
            className="flex-1 py-3 px-2 outline-none"
            placeholder="Search for..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {/* Select */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border-t md:border-t-0 md:border-l px-3 py-2 text-sm text-gray-600"
          >
            {types.map((type) => (
              <option key={type.TypesID}>{type.TypesName}</option>
            ))}
          </select>

          {/* Button */}
          <button
            onClick={() => navigate(`/service?keyword=${keyword}&type=${type}`)}
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            Search
          </button>

        </div>

      </section>
      <Footer />
    </div>
  );
}

