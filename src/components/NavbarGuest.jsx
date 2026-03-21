import { useState } from "react";
import { Link } from "react-router-dom";

const NavbarGuest = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex flex-col leading-snug">
          <span className="font-bold text-xl">WebbyFrames</span>
          <span className="text-xs text-gray-500">for Figma</span>
        </div>

        

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
          <Link to="/" className="hover:text-blue-600">HOME</Link>
          <Link to="/service" className="hover:text-blue-600">SERVICE</Link>
          <Link to="/community" className="hover:text-blue-600">COMMUNITY</Link>
          <Link to="/notfound" className="hover:text-blue-600">ABOUT US</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="flex space-x-3">
          <a href="/register" className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-gray-200">
            Register
          </a>
          <a href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
            Login
          </a>
        </div>
        {/* Hamburger Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 text-sm text-gray-700">
          <Link to="/" onClick={() => setIsOpen(false)}>HOME</Link>
          <Link to="/service" onClick={() => setIsOpen(false)}>SERVICE</Link>
          <Link to="/community" onClick={() => setIsOpen(false)}>COMMUNITY</Link>
          <Link to="/notfound" onClick={() => setIsOpen(false)}>ABOUT US</Link>
        </div>
      )}
    </header>
  );
};

export default NavbarGuest;