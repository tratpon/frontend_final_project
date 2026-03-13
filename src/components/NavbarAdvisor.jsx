import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const NavbarAdvisor = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const menuRef = useRef();
    const navigate = useNavigate();
    const { setUser, imageUserUrl } = useAuth();

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
        <header className="flex w-full justify-between items-center py-4 px-10 bg-white shadow-md">
            {/* Logo */}
            <div className="flex flex-col leading-snug">
                <span className="font-bold text-xl">WebbyFrames</span>
                <span className="text-xs text-gray-500">for Figma</span>
            </div>

            <div className="flex space-x-6">
                {/* Navigation */}
                <nav className="flex items-center space-x-6 text-sm text-gray-700">
                    <Link to="/" className="hover:text-blue-600">HOME</Link>
                    <Link to="/service" className="hover:text-blue-600">SERVICE</Link>
                    <Link to="/community" className="hover:text-blue-600">COMMUNITY</Link>
                    <Link to="/notfound" className="hover:text-blue-600">ABOU US</Link>

                </nav>

                {/* Profile Icon + Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                        {imageUserUrl ? (
                            <img
                                src={imageUserUrl}
                                className="w-full h-full object-cover"
                                alt="profile"
                            />
                        ) : (
                            "👤"
                        )}
                    </button>

                    {/* Dropdown menu */}
                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                            <Link to="/advisor/AdvisorProfile" className="w-full block px-4 py-2 text-left hover:bg-gray-100">
                                Profile
                            </Link>

                            <Link to="/session" className="w-full block px-4 py-2  hover:bg-gray-100">
                                Chat
                            </Link>
                            <Link to="/advisor/TimeManegemet" className="w-full block px-4 py-2 hover:bg-gray-100">
                                Manage Time
                            </Link>
                            <Link to="/advisor/ServiceList" className="w-full block px-4 py-2 hover:bg-gray-100">
                               Manage Service
                            </Link>
                            <Link to="/advisor/ManageBooking" className="w-full block px-4 py-2 hover:bg-gray-100">
                                Manage Booking
                            </Link>

                            <Link to="/history" className="w-full block px-4 py-2 hover:bg-gray-100">
                                Hisrory
                            </Link>

                            <hr className="my-1" />
                            <button onClick={handleLogOut} className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                                Logout
                            </button>


                        </div>
                    )}
                </div>

            </div>

        </header>
    );
};

export default NavbarAdvisor;