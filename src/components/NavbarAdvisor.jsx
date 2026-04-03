import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  MessageSquare, 
  Briefcase, 
  CalendarCheck, 
  Clock, 
  History,
  LayoutDashboard
} from "lucide-react";

const NavbarAdvisor = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { setUser, imageUserUrl } = useAuth();

    // 🔹 สไตล์สำหรับ Desktop Nav
    const getNavLinkClass = ({ isActive }) =>
        `transition-colors duration-200 font-medium ${
            isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
        }`;

    // 🔹 สไตล์สำหรับ Dropdown Nav (Advisor Menu)
    const getDropdownLinkClass = ({ isActive }) =>
        `flex items-center space-x-3 px-4 py-2.5 transition-all duration-200 ${
            isActive 
                ? "bg-blue-50 text-blue-600 font-bold border-r-4 border-blue-600" 
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        }`;

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            navigate("/");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

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
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 md:px-8">
                
                {/* Logo Section */}
                <div 
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => navigate("/main")}
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                        A
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-bold text-lg text-gray-900 tracking-tight">Advisor</span>
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Workspace</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink to="/main" end className={getNavLinkClass}>หน้าหลัก</NavLink>
                    <NavLink to="/service" className={getNavLinkClass}>บริการ</NavLink>
                    <NavLink to="/community" className={getNavLinkClass}>คอมมูนิตี้</NavLink>
                    <NavLink to="/AboutUS" className={getNavLinkClass}>เกี่ยวกับเรา</NavLink>
                </nav>

                {/* Right Side */}
                <div className="flex items-center space-x-3">
                    {/* Hamburger Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => { setIsOpen(!isOpen); setOpenMenu(false); }}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Profile & Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => { setOpenMenu(!openMenu); setIsOpen(false); }}
                            className={`flex items-center space-x-2 p-1 pr-2 rounded-full transition-all ${
                                openMenu ? 'bg-gray-100' : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                                {imageUserUrl ? (
                                    <img src={imageUserUrl} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-blue-600" />
                                )}
                            </div>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${openMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {openMenu && (
                            <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">แผงควบคุมผู้เชี่ยวชาญ</p>
                                </div>

                                <NavLink to="/advisor/AdvisorProfile" className={getDropdownLinkClass} onClick={() => setOpenMenu(false)}>
                                    <User size={18} /> <span>โปรไฟล์ผู้เชี่ยวชาญ</span>
                                </NavLink>

                                <NavLink to="/session" className={getDropdownLinkClass} onClick={() => setOpenMenu(false)}>
                                    <MessageSquare size={18} /> <span>แชท/ข้อความ</span>
                                </NavLink>

                                <NavLink to="/advisor/ServiceList" className={getDropdownLinkClass} onClick={() => setOpenMenu(false)}>
                                    <Briefcase size={18} /> <span>จัดการบริการ</span>
                                </NavLink>

                                <NavLink to="/advisor/ManageBooking" className={getDropdownLinkClass} onClick={() => setOpenMenu(false)}>
                                    <CalendarCheck size={18} /> <span>จัดการการจอง</span>
                                </NavLink>

                                <NavLink to="/advisor/TimeManagement" className={getDropdownLinkClass} onClick={() => setOpenMenu(false)}>
                                    <Clock size={18} /> <span>จัดการเวลาว่าง</span>
                                </NavLink>

                                <NavLink to="/advisor/AdviosrHistory" className={getDropdownLinkClass} onClick={() => setOpenMenu(false)}>
                                    <History size={18} /> <span>ประวัติการให้บริการ</span>
                                </NavLink>

                                <div className="my-1 border-t border-gray-50"></div>
                                <button 
                                    onClick={handleLogOut} 
                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                                >
                                    <LogOut size={18} /> <span>ออกจากระบบ</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 py-6 px-6 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
                    <NavLink to="/main" className={getNavLinkClass} onClick={() => setIsOpen(false)}>หน้าหลัก</NavLink>
                    <NavLink to="/service" className={getNavLinkClass} onClick={() => setIsOpen(false)}>บริการ</NavLink>
                    <NavLink to="/community" className={getNavLinkClass} onClick={() => setIsOpen(false)}>คอมมูนิตี้</NavLink>
                    <NavLink to="/AboutUS" className={getNavLinkClass} onClick={() => setIsOpen(false)}>เกี่ยวกับเรา</NavLink>
                </div>
            )}
        </header>
    );
};

export default NavbarAdvisor;