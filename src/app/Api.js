import axios from 'axios';
import { privateApi ,publicApi } from './ApiTypes';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";



export const fetchRooms = () => api.get('/chatroom').then(res => res.data.rooms);

export const joinFromBooking =
async(bookID)=>
await privateApi
.get(`enter/${bookID}`)
.then(res=>res.data);

// SessionRoom //
export const fetchMySessions = () => privateApi.get("session/mysessions").then(res => res.data);
export const fetchMySessionsAdvisor= () => privateApi.get("session/mysessionsadvisor").then(res => res.data);
export const getRoomByBookingAdvisor = (bookingId) => privateApi.get(`/session/joinforadvisor/${bookingId}`).then(res => res.data);
export const getRoomByBooking = (bookingId) => privateApi.get(`/session/join/${bookingId}`).then(res => res.data);
export const joinRoom = (roomId) => privateApi.post(`/session/joinroom`,{roomId}).then(res => res.data);
export const completedRoom = (roomId) => privateApi.post(`/session/completedRoom`,roomId).then(res => res.data);
export const fetchMessages = (roomId) =>privateApi.get(`/session/getmessage/${roomId}`).then(res => res.data);
            

export const fetchServiceByAdvisor= () => privateApi.get('/mangeservice/getAllServiceAdvisor').then(res => res.data);
export const fetchAvailability = () =>privateApi.get('/mangeservice/getAvailability').then(res => res.data);
export const createAvailability = (data) =>privateApi.post('/mangeservice/createAvailability', data).then(res => res.data);
export const deleteAvailability = (id) => privateApi.post(`/mangeservice/deleteAvailability/${id}`).then(res => res.data);



export const fetchTypes = () => publicApi.get('/service').then(res => res.data.types);
export const fetchfilterPost = (type) => publicApi.get(`/community/getFillter?Type=${type}`).then(res => res.data.posts);
export const fetchYourPost = (type) => privateApi.get(`/community/getyourpost?Type=${type}`).then(res => res.data.posts);
export const fetchComment = (postId) => publicApi.get(`/community/getComment/${postId}`).then(res => res.data.comments);
export const addComment = async (data) => await privateApi.post('/community/addComment', data).then(res => res.data);
export const addPost = async (data) => await privateApi.post('/community/addpost', data).then(res => res.data);

export const createBill = (data) => privateApi.post('/booking/createbill', data).then(res => res.data);
export const uploadSlip = (data) => privateApi.post('/booking/uploadSlip', data).then(res => res.data);

export const updateBillStatus = (billId) =>
  privateApi.push(`/service/${billId}`).then(res => res.data);

export const fetchAllService = () => publicApi.get('/service/getlist').then(res => res.data);
export const fetchDetailService = (id) => publicApi.get(`/service/getdetail/${id}`).then(res => res.data);
export const fetchSlotDaysInMonth = (serviceID, year, month) => publicApi.get(`/service/getSlotDaysInMonth/${serviceID}/${year}/${month}`).then(res => res.data);

export const fetchBookingDetail = (availabilityId) => privateApi.get(`/booking/detail/${availabilityId}`).then(res => res.data);


export const createBooking = async (data) => await privateApi.post('/booking/createbooking', data).then(res => res.data);

export const fetchBookingsByUser = () => privateApi.get('/booking/fetchBookingsByUser').then(res => res.data);
export const fetchHistoryUser = () => privateApi.get('/booking/fetchHistoryUser').then(res => res.data);

export const fetchBookingsByAdvisor = () => privateApi.get('/booking/fetchBookingsByAdvisor').then(res => res.data);
export const fetchBookingsByAdmin= () => privateApi.get('/booking/fetchBookingsByAdmin').then(res => res.data);
export const updateStatusSlip = (data) => privateApi.post('/booking/updateStatusSlip', data ).then(res => res.data);

export const mangeBooking = (data) =>
  privateApi.post('/booking/mangeBooking', data )
    .then(res => res.data);
    
export const updateBookingStatus = (data) => privateApi.put("/booking/updateStatus", data).then((res) => res.data);
export const fetchPayoutByAdvisor = () => privateApi.get("/booking/getPayoutByAdvisor").then((res) => res.data);
export const fetchSlots = (id, selectedDate) =>
  publicApi.get(`/service/getSlotByDate/${id}/${selectedDate}`)
     .then(res => res.data);

export const fetchfilterService = (Type, keyword) => publicApi.get(`/service/getFillter?Type=${encodeURIComponent(Type)}&keyword=${keyword}`).then(res => res.data.services);


export const registerUser = async (data) => await  privateApi.post('/auth/register', data).then(res => res.data);

export const registerAdvisor = async (data) => await  privateApi.post(`/auth/registerAdvisor`, data).then(res => res.data);

export const loginRole = async (data) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
  return await privateApi.get('/auth/login')
    .then(res => res.data);
};
export const adminlogin= async (data) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
  return await privateApi.post('/admin/adminlogin')
    .then(res => res.data);
};
export const loginAdmin = async (data) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
  return await privateApi.get('/auth/loginAdmin')
    .then(res => res.data);
};


export const fetchMyProfile = async () =>
  await privateApi.get("/userprofile/getMyProfile").then(res => res.data);

export const fetchMyAdvisorProfile = async () =>
  await privateApi.get("/userprofile/getMyAdvisorProfile").then(res => res.data);

export const updateMyProfile = async (data) =>
  await privateApi.put("/userprofile/updateMyProfile", data).then(res => res.data);


export const updateProfileAdvisor = async (data) =>
  await privateApi.put("/userprofile/updateProfileAdvisor", data).then(res => res.data);


export const fetchDetailAdvisor = async () =>
  await privateApi.get("/userprofile/getdetailadvisor").then(res => res.data);




export const addSkill = (data) =>
  privateApi.post("/userprofile/addskilladvisor", data).then(res => res.data);

export const updateSkill = ({id, description}) =>
  privateApi.put(`/userprofile/updateskilladvisor/${id}`, {description}).then(res => res.data);

export const deleteSkill = (id) =>
  privateApi.delete(`/userprofile/deletskilladvisor/${id}`).then(res => res.data);

export const updatebio = ({bio}) =>
  privateApi.put("/userprofile/updatebio", {bio}).then(res => res.data);
// Education
export const addEducation = (data) =>
  privateApi.post("/userprofile/addEducationAdvisor", data).then(res => res.data);

export const updateEducation = (data) =>
  privateApi.put(`/userprofile/updateEducationAdvisor/${data.id}`, data).then(res => res.data);

export const deleteEducation = (id) =>
  privateApi.delete(`/userprofile/deleteEducationAdvisor/${id}`).then(res => res.data);

// Experience
export const addExperience = (data) =>
  privateApi.post("/userprofile/addExperienceAdvisor", data).then(res => res.data);

export const updateExperience = (data) =>
  privateApi.put(`/userprofile/updateExperienceAdvisor/${data.id}`, data).then(res => res.data);

export const deleteExperience = (id) =>
  privateApi.delete(`/userprofile/deleteExperienceAdvisor/${id}`).then(res => res.data);






export const fetchPostAdmin = (type) =>
  privateApi.get(`/admin/getpostadmin?Type=${type}`).then(res => res.data);


export const updatepoststatus = (data) =>
  privateApi.put(`/admin/updatepoststatus`,data).then(res => res.data);


export const fetchtopics = () =>
  privateApi.get(`/review/getTopics`).then(res => res.data);


export const createreview = (data) =>
  privateApi.post(`/review/createReview`,data).then(res => res.data);

export const fetchservicerating = (id) =>
  publicApi.get(`/review/getServiceRating/${id}`).then(res => res.data);

export const fetchadvisorrating = () =>
  privateApi.get(`/review/getAdvisorRating`).then(res => res.data);


export const fetchAllServiceAdvisorByID = (id) =>
  publicApi.get(`/service/getAllServiceAdvisorByID/${id}`).then(res => res.data);

export const fetchDetailAdvisorByID = (id) =>
  publicApi.get(`/service/getDetailAdvisorByID/${id}`).then(res => res.data);



export const uploadImageMyProfile = async ({imageUserUrl}) =>
  await privateApi.put("/userprofile/uploadImageMyProfile",{imageUserUrl}).then(res => res.data);

export const uploadImageAdvisor = async ({imageAdvisorUrl}) =>
  await privateApi.put("/userprofile/uploadImageAdvisor",{imageAdvisorUrl}).then(res => res.data);

export const fetchImageMyProfile= () =>
  privateApi.get(`/userprofile/getImageMyProfile`).then(res => res.data);


export const fetchServiceByID = (id) =>
  privateApi.get(`/mangeservice/getServiceByID/${id}`).then(res => res.data);

export const createService = (data) =>
  privateApi.post("/mangeservice/createService", data).then(res => res.data);

export const updateService = ({ id, data }) =>
  privateApi.put(`/mangeservice/updateService/${id}`, data).then(res => res.data);


export const deleteService = (id) =>
  privateApi.put(`/mangeservice/deleteService/${id}`).then(res => res.data);




export const addServiceImage = (data) =>
  privateApi.post(`/mangeservice/addServiceImage`,data).then(res => res.data);

export const deleteServiceImage = (id) =>
  privateApi.post(`/mangeservice/deleteServiceImage/${id}`).then(res => res.data);

export const applyAdvisor = (data) =>
  publicApi.post(`/admin/applyAdvisor`,data).then(res => res.data);

export const fetchApplyAdvisor = () =>
  privateApi.get(`/admin/getApplyAdvisor`).then(res => res.data.applyrows);

export const fetchApplyAdvisorByID = (id) =>
  publicApi.get(`/admin/getApplyAdvisorByID/${id}`).then(res => res.data.applyrows);

export const updateApplyAdvisor = ({id,status}) => {
  privateApi.put(`/admin/updateApplyAdvisor/${id}`,{status}).then(res => res.data);
};

export const updateStatusAccount = (data) => {
  privateApi.put(`/admin/updateStatusAccount`,data).then(res => res.data);
};

export const fetchPayout = () =>
  privateApi.get(`/admin/getPayout`).then(res => res.data);

export const fetchAdminProfile = () =>
  privateApi.get(`/admin/getAdminProfile`).then(res => res.data);

export const updatePayoutWithSlip = (data) => {
  privateApi.put('/admin/updatePayoutWithSlip', data).then(res => res.data);
};




export const fetchAdvisorDashboard = () =>
  privateApi.get(`/dashboard/getAdvisorDashboard`).then(res => res.data);

export const fetchAdminDashboard = () =>
  privateApi.get(`/dashboard/getAdminDashboard`).then(res => res.data);

export const fetchAllUserAndAdvisor = () =>
  privateApi.get(`/dashboard/getAllUserAndAdvisor`).then(res => res.data);

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "final_project");

    const res = await fetch(
        import.meta.env.VITE_API_cloudinary,
        {
            method: "POST",
            body: formData
        }
    );


  return await res.json();
};

