import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300 py-6 px-10">
      <div className="flex justify-between items-center">

        <span className="text-sm">
          CompanyName © 202X. All rights reserved.
        </span>

        <div className="flex space-x-8 text-sm">
          <NavLink to = "/AdvisorApply">work wiht us</NavLink>
          <span>Twelve</span>
          <span>Thirteen</span>
          <span>Fourteen</span>  
          <span>Fifteen</span>
        </div>

        {/* Social Icons (placeholder text) */}
        <div className="flex space-x-4 text-lg">
          <span>▶️</span>
          <span>👍</span>
          <span>🐦</span>
          <span>📸</span>
          <span>💼</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
