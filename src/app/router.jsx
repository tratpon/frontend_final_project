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
import ChatPage from "../pages/ChatPage.jsx";
import BookingStatus from "../pages/user/BookingStatus.jsx";


import Admin from '../pages/admin/AdminPage.jsx';
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminApprove from "../pages/admin/AdminApprove.jsx";
import AdminApproveForm from "../pages/admin/AdminApproveForm.jsx";
import AdminApprovePost from "../pages/admin/AdminApprovePost.jsx";
import NotFound from "../pages/NotFound.jsx";
import AboutUS from "../pages/AboutUS.jsx";


import Advisor from "../pages/advisor/Advisor.jsx";
import Enrollment from "../pages/admin/Enrollment.jsx";
import AdvisorServiceList from "../pages/advisor/AdvisorServiceList.jsx";
import ManegeSevice from "../pages/advisor/ManegeService.jsx";
import AdvisorTimeManegemet from "../pages/advisor/AdvisortimeManegement.jsx";
import AdvisorProfile from "../pages/advisor/AdvisorProfile.jsx";
import AdviosrHistory from "../pages/advisor/AdvisorHistory.jsx";

import RequireAuth from "./RequireAuth.jsx";
import AdvisorManageBooking from "../pages/advisor/AdvisorManageBooking.jsx";
import AdvisorApply from "../pages/applyAdvisorPage.jsx";

import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdvisorRegister from "../pages/AdvisorRegister.jsx";
import AdminApproveSlip from "../pages/admin/AdminApproveSlip.jsx";
import AdminPayout from "../pages/admin/AdminPayout.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";

import SessionRoom from "../pages/SessionRoomPage.jsx";
export default function AppRouter() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<RequireAuth />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/advisor/register/:id" element={<AdvisorRegister />} />
            <Route path="/main" element={<Mainpage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/detail/:id" element={<DetailServicePage />} />
            <Route path="/AdviserProfile/:id" element={<AdviserProfilePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/session" element={<SessionRoom />} />
            <Route path="/AboutUS" element={<AboutUS />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/AdvisorApply" element={<AdvisorApply />} />
            <Route path="/community" element={<Community />} />

            {/* USER */}
            
            <Route element={<RequireRole allow={[ROLES.USER]} />}>
                <Route path="/history" element={<Hisrory />} />
                <Route path="/Booking" element={<Booking />} />
                <Route path="/enrollment" element={<Enrollment />} />
                <Route path="/UserProfile" element={<UserProfile />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/BookingStatus" element={<BookingStatus />} />
            </Route>
            
            {/* ADVISOR */}
            <Route element={<RequireRole allow={[ROLES.ADVISOR]} />}>
                <Route path="/Advisor" element={<Advisor />} />
                <Route path="/Advisor/AdvisorProfile" element={<AdvisorProfile />} />
                <Route path="/Advisor/ServiceList" element={<AdvisorServiceList />} />
                <Route path="/Advisor/ManegeService/:id?" element={<ManegeSevice />} />
                <Route path="/Advisor/TimeManagement" element={<AdvisorTimeManegemet />} />
                <Route path="/Advisor/ManageBooking" element={<AdvisorManageBooking/>}/>
                <Route path="/Advisor/AdviosrHistory" element={<AdviosrHistory/>}/>
            </Route>
           

            {/* ADMIN */}

            <Route element={<RequireRole allow={[ROLES.ADMIN]} />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/Dashboard" element={<AdminDashboard />} ></Route>
                <Route path="/admin/Approve" element={<AdminApprove />} ></Route>
                <Route path="/admin/Approve/Form/:id" element={<AdminApproveForm />} ></Route>
                <Route path="/admin/Approve/post" element={<AdminApprovePost />} ></Route>
                <Route path="/admin/Approve/slip" element={<AdminApproveSlip />} ></Route>
                <Route path="/admin/Approve/Payout" element={<AdminPayout />} ></Route>
                <Route path="/admin/AdminProfile" element={<AdminProfile />} ></Route>
            </Route>
        </Routes>
    );
}
