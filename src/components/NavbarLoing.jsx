import { BrowserRouter as Router, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const NavbarLoin = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const { setUser, imageUserUrl } = useAuth();

    const getNavLinkClass = ({ isActive }) =>
        isActive ? "text-blue-700 " : "hover:text-blue-600";


    const getNavLinkhambergerClass = ({ isActive }) =>
        isActive ? "block px-4 py-2 text-blue-700 " : "block px-4 py-2 hover:bg-gray-100";

    const handleLogOut = async () => {
        try {
            console.log(auth.currentUser)
            await signOut(auth);
            setUser(null);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };


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


        <header className="relative flex justify-between items-center py-4 px-4 md:px-10 bg-white shadow-md">

            {/* Logo */}
            <div className="flex flex-col leading-snug">
                <span className="font-bold text-xl">WebbyFrames</span>
                <span className="text-xs text-gray-500">for Figma</span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6 text-x text-gray-700">
                <NavLink to="/main" end className={getNavLinkClass}>หน้าหลัก</NavLink>
                <NavLink to="/service" className={getNavLinkClass}>บริการ</NavLink>
                <NavLink to="/community" className={getNavLinkClass}>คอมมูนิตี้</NavLink>
                <NavLink to="/notfound" className={getNavLinkClass}>เกี่ยวกับเรา</NavLink>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
                {/* Hamburger */}
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center text-xl"
                    onClick={() => { setIsOpen(!isOpen), setOpenMenu(false) }}
                >
                    ☰
                </button>
                {/* Profile */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => { setOpenMenu(!openMenu), setIsOpen(false); }}
                        className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                    >
                        {imageUserUrl ? (
                            <img src={imageUserUrl} className="w-full h-full object-cover" />
                        ) : "👤"}
                    </button>

                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                            <NavLink to="/UserProfile" className={getNavLinkhambergerClass}>หน้าหลัก</NavLink>
                            <NavLink to="/session" className={getNavLinkhambergerClass}>แชท</NavLink>
                            <NavLink to="/BookingStatus" className={getNavLinkhambergerClass}>สถานะการจอง</NavLink>
                            <NavLink to="/history" className={getNavLinkhambergerClass}>ประวัติ</NavLink>
                            <hr />
                            <button onClick={handleLogOut} className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start p-4 space-y-4 md:hidden">
                    <NavLink to="/main" className={getNavLinkClass} onClick={() => setIsOpen(false)}>หน้าหลัก</NavLink>
                    <NavLink to="/service" className={getNavLinkClass} onClick={() => setIsOpen(false)}>บริการ</NavLink>
                    <NavLink to="/community" className={getNavLinkClass} onClick={() => setIsOpen(false)}>คอมมูนิตี้</NavLink>
                    <NavLink to="/notfound" className={getNavLinkClass} onClick={() => setIsOpen(false)}>เกี่ยวกับเรา</NavLink>
                </div>
            )}

        </header>
    );
};

export default NavbarLoin;