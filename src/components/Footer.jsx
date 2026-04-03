import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-500 py-4 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left: Copyright */}
        <div className="text-xs font-medium uppercase tracking-wider">
          © {new Date().getFullYear()} <span className="text-slate-300">CompanyName</span>
        </div>

        {/* Center: Quick Links (ถ้าไม่เอาก็ตัดออกได้เลย) */}
        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest">
          <NavLink to="/AdvisorApply" className="hover:text-blue-400 transition-colors">ร่วมงานกับเรา</NavLink>
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
        </div>

        {/* Right: Simple Social/Contact */}
        <div className="flex gap-4 items-center text-[11px]">
          <span className="hidden md:inline text-slate-600">|</span>
          <div className="flex gap-3">
             <span className="hover:text-white cursor-default">LINE: @TEST</span>
             <span className="hover:text-white cursor-default">FB: TESTPAGE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;