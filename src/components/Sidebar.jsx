import { NavLink } from "react-router-dom";
import { House, Airplay, User, MessageSquareText, Receipt, BanknoteArrowDown} from "lucide-react";
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
            <div className="flex justify-end gap-3 hover:text-blue-600">
                <button onClick={handleLogOut} className="w-full px-4 py-2 text-center text-red-600 hover:bg-gray-100">
                    Logout
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;