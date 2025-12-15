import { BrowserRouter as Router, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const NavbarAdim = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const menuRef = useRef();

    // ปิด dropdown เมื่อคลิกรอบนอก
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <header className="flex justify-between items-center py-4 px-10 bg-white shadow-md">
            {/* Logo */}
            <div className="flex flex-col leading-snug">
                <span className="font-bold text-xl">WebbyFrames</span>
                <span className="text-xs text-gray-500">for Figma</span>
            </div>
            <div className="flex space-x-6">

                {/* Profile Icon + Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                        <span className="text-gray-600 text-xl">👤</span>
                    </button>

                    {/* Dropdown menu */}
                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                            <a href="/community" className="w-full block px-4 py-2 text-left hover:bg-gray-100">
                                community
                            </a>
                            <a href="/history" className="w-full block px-4 py-2 text-left hover:bg-gray-100">
                                Hisrory
                            </a>

                            <a href="/admin" className="w-full block px-4 py-2 text-left hover:bg-gray-100">
                                AdminPage
                            </a>

                            <hr className="my-1" />
                            <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                                Logout
                            </button>


                        </div>
                    )}
                </div>

            </div>
          
        </header>
        
    );
}
export default NavbarAdim;