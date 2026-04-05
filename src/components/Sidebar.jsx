import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  House,
  Airplay,
  UserCheck,
  LayoutGrid,
  Receipt,
  Banknote,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Sidebar = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // ปรับการจัดการ Class สำหรับ NavLink ให้ดูสวยงามขึ้น
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
    }`;

  const handleLogOut = async () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      try {
        await signOut(auth);
        setUser(null);
        navigate("/admin/login");
      } catch (error) {
        console.error("Logout Error:", error);
      }
    }
  };

  return (
    <aside className="fixed w-72 h-screen bg-white border-r border-slate-100 p-6 flex flex-col justify-between z-50">
      
      {/* Top Section: Brand & Navigation */}
      <div>
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <ShieldCheck size={24} />
          </div>
          <span className="font-black text-xl text-slate-800 tracking-tight">AdminPanel</span>
        </div>

        <nav className="space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          
          <NavLink to="/admin" end className={getNavLinkClass}>
            <House size={20} />
            <span className="font-bold text-sm">Account</span>
          </NavLink>

          <NavLink to="/admin/Dashboard" className={getNavLinkClass}>
            <Airplay size={20} />
            <span className="font-bold text-sm">Dashboard</span>
          </NavLink>

          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">Verification</p>

          <NavLink to="/admin/Approve" end className={getNavLinkClass}>
            <UserCheck size={20} />
            <span className="font-bold text-sm">Advisors Approval</span>
          </NavLink>

          <NavLink to="/admin/Approve/post" end className={getNavLinkClass}>
            <LayoutGrid size={20} />
            <span className="font-bold text-sm">Review Posts</span>
          </NavLink>

          <NavLink to="/admin/Approve/slip" end className={getNavLinkClass}>
            <Receipt size={20} />
            <span className="font-bold text-sm">Verify Slips</span>
          </NavLink>

          <NavLink to="/admin/Approve/Payout" end className={getNavLinkClass}>
            <Banknote size={20} />
            <span className="font-bold text-sm">Manage Payouts</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section: Profile & Logout */}
      <div className="space-y-2">
        <Link
          to="/admin/AdminProfile"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <span className="text-xs">AD</span>
          </div>
          <span className="font-bold text-sm">Admin Account</span>
        </Link>

        <button
          onClick={handleLogOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm rounded-2xl transition-all hover:bg-red-50 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Log Out</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;