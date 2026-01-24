import { BrowserRouter as Router, Link,NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Sidebar = () => {
    const getNavLinkClass = ({ isActive }) => {
        if (isActive) {
            return "text-blue-700 border-b-2 border-blue-700";
        } 
    };
    return (
        <aside className="fixed w-64 h-full bg-white p-6 float-right">
            <div className="mb-10 font-bold text-lg">WebbyFrames</div>
            <nav className="flex flex-col gap-6">

                <div className="flex items-center gap-3 hover:text-blue-600">
                    🏠 <NavLink to="/admin"end  className={getNavLinkClass}>account</NavLink>
                </div>

                <div className="flex items-center gap-3 hover:text-blue-600">
                    💰 <NavLink to="/admin/Dashboard" className={getNavLinkClass}>Dashboard</NavLink>
                </div>
                <div className="flex items-center gap-3 hover:text-blue-600">
                    👤 <NavLink to="/admin/Approve" className={getNavLinkClass}>Approve</NavLink>
                </div>
            </nav>
        </aside>
    );

}
export default Sidebar;

