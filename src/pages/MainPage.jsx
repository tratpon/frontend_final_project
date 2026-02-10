import Footer from '../components/Footer.jsx';
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTypes } from '../app/Api.js';
import { useState , useEffect} from 'react';



export default function Mainpage() {
  const [search, setSearch] = useState("");
  const [selectType, setSelectType] = useState("");
  const navigate = useNavigate();
  const { data: types = [] } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (types.length > 0) {
      setSelectType(types[0].TypesName);
    }
  }, [types]);;


  return (
    <div className="min-h-screen flex flex-col">
      <NavbarSwitcher />
      <section className="h-screen bg-gray-200 py-20 flex flex-col items-center text-center justify-center">


        {/* Welcome Text */}
        <h1 className="text-6xl font-semibold mb-8">welcome</h1>

        {/* Search Bar */}
        <div className="flex w-3/4 lg:w-1/2 bg-white border rounded shadow-sm">
          <div className="flex items-center px-3 text-gray-400">
            🔍
          </div>
          <input
            className="flex-1 py-3 px-2 outline-none"
            placeholder="Search for..."
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}
          />

          <select value={selectType} onChange={(e) => { setSelectType(e.target.value) }} className="border-l px-3 text-sm text-gray-600">

            {types.map((type) => (
              <option key={type.TypesID}>{type.TypesName}</option>
            ))
            }
          </select>
          <button onClick={() =>
            navigate(`/service?search=${search}&type=${selectType}`)
          } className="px-6 bg-blue-600 text-white hover:bg-blue-700">
            Search
          </button>
        </div>

      </section>
      <Footer />
    </div>
  );
}

