import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react"; // ใช้ Icon เพื่อความทันสมัย

const NavbarGuest = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    
    // ตรวจสอบการ Scroll เพื่อปรับสไตล์ Navbar (เหมือนหน้า Login)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔹 สไตล์สำหรับ Desktop NavLink (มีเส้นขีดใต้เมื่อ Active)
    const getNavLinkClass = ({ isActive }) =>
        `transition-colors duration-200 font-medium ${
            isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }`;
    return (
        <header className={`sticky top-0 z-[100] transition-all duration-500 ${
            scrolled 
                ? "bg-white/80 backdrop-blur-md shadow-lg shadow-blue-900/5 py-3" 
                : "bg-white border-b border-gray-100 py-4"
        }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8">
                
                {/* Logo Section */}
                <div 
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => navigate("/")}
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all duration-300">
                        A
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-black text-xl text-gray-800 tracking-tighter uppercase">Advisor<span className="text-blue-600">.</span></span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">For Help</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-10">
                    <NavLink to="/main" end className={getNavLinkClass}>หน้าหลัก</NavLink>
                    <NavLink to="/service" className={getNavLinkClass}>บริการ</NavLink>
                    <NavLink to="/community" className={getNavLinkClass}>คอมมูนิตี้</NavLink>
                    <NavLink to="/AboutUS" className={getNavLinkClass}>เกี่ยวกับเรา</NavLink>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-2">
                    <NavLink 
                        to="/register" 
                        className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all"
                    >
                        ลงทะเบียน
                    </NavLink>
                    <NavLink 
                        to="/login" 
                        className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                    >
                        ล็อกอิน
                        <ArrowRight size={14} strokeWidth={3} />
                    </NavLink>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="md:hidden p-2 text-gray-600 hover:bg-blue-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Sidebar */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ease-in-out origin-top ${
                isOpen ? 'scale-y-100 opacity-100 visible' : 'scale-y-0 opacity-0 invisible h-0'
            }`}>
                <div className="p-8 flex flex-col space-y-6">
                    <NavLink to="/main" onClick={() => setIsOpen(false)} className={getNavLinkClass}>หน้าหลัก</NavLink>
                    <NavLink to="/service" onClick={() => setIsOpen(false)} className={getNavLinkClass}>บริการ</NavLink>
                    <NavLink to="/community" onClick={() => setIsOpen(false)} className={getNavLinkClass}>คอมมูนิตี้</NavLink>
                    <NavLink to="/AboutUS" onClick={() => setIsOpen(false)} className={getNavLinkClass}>เกี่ยวกับเรา</NavLink>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <NavLink to="/register" onClick={() => setIsOpen(false)} className="py-4 text-center text-[10px] font-black uppercase tracking-widest border-2 border-gray-100 rounded-2xl">ลงทะเบียน</NavLink>
                        <NavLink to="/login" onClick={() => setIsOpen(false)} className="py-4 text-center text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">ล็อกอิน</NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavbarGuest;