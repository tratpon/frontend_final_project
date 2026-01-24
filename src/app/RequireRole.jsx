import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { ROLES } from "./roles";

export default function RequireRole({ allow }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (allow.includes(user)) {
        return <Outlet />;
    }
    
    return <Navigate to="/notfound" replace />;
    // switch (user) {
    //     case ROLES.ADMIN:
    //         return <Navigate to="/admin" replace />;
    //     case ROLES.ADMIN:
    //         return <Navigate to="/management" replace />;
    //     case ROLES.USER:
    //         return <Navigate to="/community" replace />;
    //     default:
    //         return <Navigate to="/notfound" replace />;
    // }
}