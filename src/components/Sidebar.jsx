import { NavLink, Link } from "react-router-dom";
import { House, Airplay, User, MessageSquareText, Receipt, BanknoteArrowDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";


const Sidebar = () => {
    const { setUser } = useAuth();
    const getNavLinkClass = ({ isActive }) =>
        isActive ? "text-blue-700 border-b-2 border-blue-700" : "";

    const handleLogOut = async () => {
        try {
            console.log(auth.currentUser)
            await signOut(auth);
            setUser(null);
            navigate("/admin/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <aside className="fixed w-64 h-screen bg-white p-6 flex flex-col justify-between">

            {/* ด้านบน */}
            <div>
                <div className="mb-10 font-bold text-lg">WebbyFrames</div>

                <nav className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 hover:text-blue-600">
                        <House />
                        <NavLink to="/admin" end className={getNavLinkClass}>
                            บัญชี
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-3 hover:text-blue-600">
                        <Airplay />
                        <NavLink to="/admin/Dashboard" className={getNavLinkClass}>
                            แดชบอร์ด
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-3 hover:text-blue-600">
                        <User />
                        <NavLink to="/admin/Approve" end className={getNavLinkClass}>
                            อนุมัติ advisor
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-3 hover:text-blue-600">
                        <MessageSquareText />
                        <NavLink to="/admin/Approve/post" end className={getNavLinkClass}>
                            โพสต์
                        </NavLink>
                    </div>
                    <div className="flex items-center gap-3 hover:text-blue-600">
                        <Receipt />
                        <NavLink to="/admin/Approve/slip" end className={getNavLinkClass}>
                            ตรวจสอบสลิป
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-3 hover:text-blue-600">
                        <BanknoteArrowDown />
                        <NavLink to="/admin/Approve/Payout" end className={getNavLinkClass}>
                            จ่ายเงิน
                        </NavLink>
                    </div>
                </nav>
            </div>

            {/* ด้านล่าง */}
            <div className="flex flex-col justify-center gap-1 p-2">
                {/* เมนูบัญชี */}
                <Link
                    to="/admin/AdminProfile"
                    end
                    className={`${getNavLinkClass} flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600`}
                >
                    <span>👤</span> บัญชีผู้ดูแลระบบ
                </Link>

                <hr className="my-2 border-gray-100" />

                {/* ปุ่มออกจากระบบ */}
                <button
                    onClick={handleLogOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 rounded-lg transition-colors hover:bg-red-50"
                >
                    <span>🚪</span> ออกจากระบบ
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;