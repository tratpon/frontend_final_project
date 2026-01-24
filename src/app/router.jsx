import { Routes, Route } from "react-router-dom";
import RequireRole from "./RequireRole";
import { ROLES } from "./roles";

import Mainpage from '../pages/MainPage.jsx';
import ServicePage from '../pages/ServicePage.jsx';
import DetailServicePage from '../pages/DetailServicePage.jsx';
import AdviserProfilePage from '../pages/AdviserProfilePage.jsx';
import Login from '../pages/LoginPage.jsx';
import Register from '../pages/RegisterPage.jsx';
import Community from '../pages/CommunityPage.jsx';
import Hisrory from '../pages/HistoryPage.jsx';
import Booking from "../pages/Booking.jsx";

import Admin from '../pages/admin/AdminPage.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminApprove from "../pages/admin/AdminApprove.jsx";
import AdminApproveForm from "../pages/admin/AdminApproveForm.jsx";
import NotFound from "../pages/NotFound.jsx";



export default function AppRouter() {
    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<Mainpage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/detail" element={<DetailServicePage />} />
            <Route path="/AdviserProfile" element={<AdviserProfilePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<Register />} />



            <Route path="/notfound" element={<NotFound />} />



            {/* USER */}
            
            <Route element={<RequireRole allow={[ROLES.USER]} />}>
                <Route path="/community" element={<Community />} />
                <Route path="/history" element={<Hisrory />} />
                <Route path="/Booking" element={<Booking />} />
            </Route>
            
            {/* ADVISOR */}
            {/* <Route
                path="/advisor/*"
                element={
                    <RequireRole allow={[ROLES.ADVISOR]}>
                        <AdvisorLayout />
                    </RequireRole>
                }
            /> */}

            {/* ADMIN */}
            
            <Route element={<RequireRole allow={[ROLES.ADMIN]} />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/Dashboard" element={<AdminDashboard />} ></Route>
                <Route path="/admin/Approve" element={<AdminApprove />} ></Route>
                <Route path="/admin/Approve/Form" element={<AdminApproveForm />} ></Route>
            </Route>
        </Routes>
    );
}
