import Footer from '../components/Footer.jsx';
import Card from "../components/Card";
import NavbarSwitcher from '../app/NavbarSwitcht.jsx';

export default function ServicePage() {
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
              className="w-full py-2 outline-none"
            />
          </div>

          <select className="border rounded-lg px-3 py-2 bg-white">
            <option>All Categories</option>
            <option>UI Design</option>
            <option>Web Dev</option>
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

