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
import Hisrory from '../pages/user/HistoryPage.jsx';
import Booking from "../pages/user/Booking.jsx";
import UserProfile from "../pages/user/UserProfile.jsx";

import Admin from '../pages/admin/AdminPage.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminApprove from "../pages/admin/AdminApprove.jsx";
import AdminApproveForm from "../pages/admin/AdminApproveForm.jsx";
import NotFound from "../pages/NotFound.jsx";


import Advisor from "../pages/advisor/Advisor.jsx";
import Enrollment from "../pages/admin/Enrollment.jsx";
import AdvisorServiceList from "../pages/advisor/AdvisorServiceList.jsx";
import ManegeSevice from "../pages/advisor/ManegeService.jsx";
import AdvisorTimeManegemet from "../pages/advisor/AdvisortimeManegement.jsx";


import RequireAuth from "./RequireAuth.jsx";

export default function AppRouter() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<RequireAuth />} />

            <Route path="/main" element={<Mainpage />} />
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
                <Route path="/enrollment" element={<Enrollment />} />
                <Route path="/UserProfile" element={<UserProfile />} />
            </Route>
            
            {/* ADVISOR */}
            <Route element={<RequireRole allow={[ROLES.ADVISOR]} />}>
                <Route path="/Advisor" element={<Advisor />} />
                <Route path="/Advisor/ServiceList" element={<AdvisorServiceList />} />
                <Route path="/Advisor/ManegeService" element={<ManegeSevice />} />
                <Route path="/Advisor/TimeManegemet" element={<AdvisorTimeManegemet />} />
                
            </Route>
           

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
