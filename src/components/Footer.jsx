import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-gray-300 py-6 px-4 md:px-10">
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">

    <span className="text-sm text-center md:text-left">
      CompanyName © 202X. All rights reserved.
    </span>

    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
      <NavLink to="/AdvisorApply">work with us</NavLink>
      <span>Twelve</span>
      <span>Thirteen</span>
      <span>Fourteen</span>  
      <span>Fifteen</span>
    </div>

    {/* Social Icons */}
    <div className="flex justify-center md:justify-end space-x-4 text-lg">
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
