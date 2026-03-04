import axios from 'axios';
import { privateApi ,publicApi } from './ApiTypes';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const api = axios.create({ baseURL: 'http://localhost:3001/api' });


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
export const joinRoom = (roomId) => privateApi.post(`/session/joinroom`, { roomId }).then(res => res.data);
export const leaveRoom = (roomId) => privateApi.post(`/session/leaveRoom`, { roomId }).then(res => res.data);
export const fetchMessages = (roomId) =>privateApi.get(`/session/getmessage/${roomId}`).then(res => res.data);
            

export const fetchServiceByAdvisor= () => privateApi.get('/mangeservice/getAllServiceAdvisor').then(res => res.data);
export const fetchAvailability = () =>privateApi.get('/mangeservice/getAvailability').then(res => res.data);
export const createAvailability = (data) =>privateApi.post('/mangeservice/createAvailability', data).then(res => res.data);
export const deleteAvailability = (id) => privateApi.post(`/mangeservice/deleteAvailability/${id}`).then(res => res.data);



export const fetchTypes = () => api.get('/service').then(res => res.data.types);
export const fetchfilterPost = (type) => api.get(`/community/getFillter?Type=${type}`).then(res => res.data.posts);
export const fetchComment = (postId) => api.get(`/community/getComment/${postId}`).then(res => res.data.comments);
export const addComment = async (data) => await privateApi.post('/community/addComment', data).then(res => res.data);
export const addPost = async (data) => await privateApi.post('/community/addpost', data).then(res => res.data);

export const createBill = (data) => privateApi.post('/booking/createbill', data).then(res => res.data);

export const updateBillStatus = (billId) =>
  privateApi.push(`/service/${billId}`).then(res => res.data);

export const fetchAllService = () => api.get('/service/getlist').then(res => res.data);
export const fetchDetailService = (id) => api.get(`/service/getdetail/${id}`).then(res => res.data);

export const fetchBookingDetail = (availabilityId) => privateApi.get(`/booking/detail/${availabilityId}`).then(res => res.data);


export const createBooking = async (data) => await privateApi.post('/booking/createbooking', data).then(res => res.data);

export const fetchBookingsByUser = () => privateApi.get('/booking/fetchBookingsByUser').then(res => res.data);

export const fetchBookingsByAdvisor = () => privateApi.get('/booking/fetchBookingsByAdvisor').then(res => res.data);

export const mangeBooking = (data) =>
  privateApi.post('/booking/mangeBooking', data )
    .then(res => res.data);
    
export const updateBookingStatus = (data) => privateApi.put("/booking/updateStatus", data).then((res) => res.data);

export const fetchSlots = (id, selectedDate) =>
  api.get(`/service/getSlotByDate/${id}/${selectedDate}`)
     .then(res => res.data);

export const fetchfilterService = (Type, keyword) => api.get(`/service/getFillter?Type=${encodeURIComponent(Type)}&keyword=${keyword}`).then(res => res.data.services);


export const registerUser = async (data) => await  privateApi.post('/auth/register', data).then(res => res.data);


export const loginRole= async (data) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
  return await privateApi.post('/auth/login')
    .then(res => res.data);
};


export const fetchMyProfile = async () =>
  await privateApi.get("/userprofile/getMyProfile").then(res => res.data);

export const fetchMyAdvisorProfile = async () =>
  await privateApi.get("/userprofile/getMyAdvisorProfile").then(res => res.data);

export const updateMyProfile = async (data) =>
  await privateApi.put("/userprofile/updateMyProfile", data).then(res => res.data);


export const fetchDetailAdvisor = async () =>
  await privateApi.get("/userprofile/getdetailadvisor").then(res => res.data);

