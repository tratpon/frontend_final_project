import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Menu, X, User, LogOut, ChevronDown, Bell } from "lucide-react"; // ใช้ Icon จาก Lucide

const NavbarLogin = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const { setUser, imageUserUrl } = useAuth();

    const getNavLinkClass = ({ isActive }) =>
        `transition-colors duration-200 font-medium ${
            isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
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
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };
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
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">For Help</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink to="/main" end className={getNavLinkClass}>หน้าหลัก</NavLink>
                    <NavLink to="/service" className={getNavLinkClass}>บริการ</NavLink>
                    <NavLink to="/community" className={getNavLinkClass}>คอมมูนิตี้</NavLink>
                    <NavLink to="/AboutUS" className={getNavLinkClass}>เกี่ยวกับเรา</NavLink>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* User Interaction Area */}
                    <div className="flex items-center bg-gray-50 p-1 rounded-full border border-gray-100">
                        <div className="relative px-2 hidden sm:block">
                            <Bell size={20} className="text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
                            <span className="absolute top-0 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => { setOpenMenu(!openMenu); setIsOpen(false); }}
                                className="flex items-center space-x-2 p-0.5 rounded-full hover:bg-white hover:shadow-sm transition-all"
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

                            {/* Dropdown Menu */}
                            {openMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">บัญชีผู้ใช้</p>
                                    </div>
                                    <NavLink to="/UserProfile" className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <User size={18} /> <span>โปรไฟล์ของฉัน</span>
                                    </NavLink>
                                    <NavLink to="/session" className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <span>ข้อความ/แชท</span>
                                    </NavLink>
                                    <NavLink to="/BookingStatus" className="flex items-center space-x-3 px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <span>สถานะการจอง</span>
                                    </NavLink>
                                    <div className="my-1 border-t border-gray-50"></div>
                                    <button 
                                        onClick={handleLogOut} 
                                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors font-medium"
                                    >
                                        <LogOut size={18} /> <span>ออกจากระบบ</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => { setIsOpen(!isOpen); setOpenMenu(false); }}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar/Menu */}
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

export default NavbarLogin;