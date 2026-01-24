import { useAuth } from "../contexts/authContext";
import NavbarLoin from "../components/NavbarLoing";
import NavbarGuest from "../components/NavbarGuest";


export default function NavbarSwitcher() {
    const { user } = useAuth();
    if (!user) return <NavbarGuest />;

    return <NavbarLoin />;

}