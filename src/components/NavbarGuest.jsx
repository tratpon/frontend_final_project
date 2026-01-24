import { BrowserRouter as Router, Link } from "react-router-dom";
const NavbarGuest = () => {
  return (
    <header className="flex justify-between items-center py-4 px-10 bg-white shadow-md">
      {/* Logo */}
      <div className="flex flex-col leading-snug">
        <span className="font-bold text-xl">WebbyFrames</span>
        <span className="text-xs text-gray-500">for Figma</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-6 text-sm text-gray-700">
        <Link to="/" className="hover:text-blue-600">HOME</Link>
        <Link to="/service" className="hover:text-blue-600">SERVICE</Link>
        <Link to="/community" className="hover:text-blue-600">COMMUNITY</Link>
        <Link to="/notfound" className="hover:text-blue-600">ABOUT US</Link>

      </nav>

      {/* Actions */}
      <div className="flex space-x-3">
        <a href="/register" class="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded hover:bg-gray-200">
          Register
        </a>
        
        <a href="/login" class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
          Login
        </a>
        
      </div>
    </header>
  );
};

export default NavbarGuest;