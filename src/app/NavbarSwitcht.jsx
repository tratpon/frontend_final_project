import { useAuth } from "../contexts/AuthContext";
import NavbarLoin from "../components/NavbarLoing";
import NavbarGuest from "../components/NavbarGuest";
import NavbarAdvisor from "../components/NavbarAdvisor";
import { ROLES } from "./roles";
export default function NavbarSwitcher() {
    const { user } = useAuth();
    switch (user) {
        case ROLES.USER:
            return <NavbarLoin />;
        case ROLES.ADVISOR:
            return <NavbarAdvisor />;
        default:
            return <NavbarGuest />;
    }

}