import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavbarGuest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const getNavLinkClass = ({ isActive }) =>
    isActive ? "text-blue-700 " : "hover:text-blue-600";
  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col leading-snug">
          <span className="font-bold text-xl">WebbyFrames</span>
          <span className="text-xs text-gray-500">for Figma</span>
        </div>
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-x text-gray-700">
          <NavLink to="/" className={getNavLinkClass}>หน้าหลัก</NavLink>
          <NavLink to="/service" className={getNavLinkClass}>บริการ</NavLink>
          <NavLink to="/community" className={getNavLinkClass}>คอมมูนิตี้</NavLink>
          <NavLink to="/notfound" className={getNavLinkClass}>เกี่ยวกับเรา</NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="flex space-x-3">
          <a href="/register" className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-gray-200">
            ลงทะเบียน
          </a>
          <a href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
            ล็อกอิน
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
          <NavLink to="/" onClick={() => setIsOpen(false)}>หน้าหลัก</NavLink>
          <NavLink to="/service" onClick={() => setIsOpen(false)}>บริการ</NavLink>
          <NavLink to="/community" onClick={() => setIsOpen(false)}>คอมมูนิตี้</NavLink>
          <NavLink to="/notfound" onClick={() => setIsOpen(false)}>เกี่ยวกับเรา</NavLink>
        </div>
      )}
    </header>
  );
};

export default NavbarGuest;