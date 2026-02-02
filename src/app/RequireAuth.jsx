import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { ROLES } from "./roles";

export default function RequireAuth() {
    const { user} = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    switch (user) {
        case ROLES.USER:
            return <Navigate to="/main" replace />;
        case ROLES.ADMIN:
            return <Navigate to="/admin" replace />;
        case ROLES.ADVISOR:
            return <Navigate to="/advisor" replace />;
        default:
            return <Navigate to="/notfound" replace />;
    }
}