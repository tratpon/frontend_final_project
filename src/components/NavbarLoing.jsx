import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const NavbarLoin = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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


        <header className="relative flex justify-between items-center py-4 px-4 md:px-10 bg-white shadow-md">

            {/* Logo */}
            <div className="flex flex-col leading-snug">
                <span className="font-bold text-xl">WebbyFrames</span>
                <span className="text-xs text-gray-500">for Figma</span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
                <Link to="/">HOME</Link>
                <Link to="/service">SERVICE</Link>
                <Link to="/community">COMMUNITY</Link>
                <Link to="/notfound">ABOUT US</Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
                {/* Hamburger */}
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center text-xl"
                    onClick={() =>{setIsOpen(!isOpen),setOpenMenu(false)}}
                >
                    ☰
                </button>
                {/* Profile */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => {setOpenMenu(!openMenu),setIsOpen(false);}}
                        className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                    >
                        {imageUserUrl ? (
                            <img src={imageUserUrl} className="w-full h-full object-cover" />
                        ) : "👤"}
                    </button>

                    {openMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                            <Link to="/UserProfile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                            <Link to="/session" className="block px-4 py-2 hover:bg-gray-100">Chat</Link>
                            <Link to="/history" className="block px-4 py-2 hover:bg-gray-100">History</Link>
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
                    <Link to="/" onClick={() => setIsOpen(false)}>HOME</Link>
                    <Link to="/service" onClick={() => setIsOpen(false)}>SERVICE</Link>
                    <Link to="/community" onClick={() => setIsOpen(false)}>COMMUNITY</Link>
                    <Link to="/notfound" onClick={() => setIsOpen(false)}>ABOUT US</Link>
                </div>
            )}

        </header>
    );
};

export default NavbarLoin;