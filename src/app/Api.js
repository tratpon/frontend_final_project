import axios from 'axios';
import { privateApi ,publicApi } from './ApiTypes';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

// export const fetchRooms = () => api.get('/rooms').then(res => res.data.rooms);
// export const createRoom = (data) => api.post('/rooms', data).then(res => res.data);
// export const joinRoom = (roomId, name) => api.post(`/rooms/${roomId}/join`, { participantName: name }).then(res => res.data);



export const joinRoom = async (data) => {
  const res = await axios.post("/chatroom/join", data);
  return res.data;
};
export const fetchMySessions = async ()=>{
  const res = await privateApi.get("/chatroom/sessions");
  return res.data;
};
export const fetchRooms = () => api.get('/chatroom').then(res => res.data.rooms);

export const joinFromBooking =
async(bookID)=>
await privateApi
.get(`enter/${bookID}`)
.then(res=>res.data);

export const fetchTypes = () => api.get('/service').then(res => res.data.types);
export const fetchfilterPost = (type) => api.get(`/community/getFillter?Type=${type}`).then(res => res.data.posts);
export const fetchComment = (postId) => api.get(`/community/getComment/${postId}`).then(res => res.data.comments);
export const addComment = async (data) => await privateApi.post('/community/addComment', data).then(res => res.data);
export const addPost = async (data) => await privateApi.post('/community/addpost', data).then(res => res.data);

export const fetchAllService = () => api.get('/service/getlist').then(res => res.data);
export const fetchDetailService = (id) => api.get(`/service/getdetail/${id}`).then(res => res.data);
export const fetchSlots = (id, selectedDate) =>
  api.get(`/service/getSlotByDate`, {
    params: {
      advisorId: id,
      date: selectedDate
    }
  }).then(res => res.data);
export const fetchfilterService = (Type, keyword) => api.get(`/service/getFillter?Type=${encodeURIComponent(Type)}&keyword=${keyword}`).then(res => res.data.services);


export const registerUser = async (data) => await  privateApi.post('/auth/register', data).then(res => res.data);


export const loginUser = async (data) => {
  await signInWithEmailAndPassword(auth, data.email, data.password);
  return await privateApi.post('/auth/login')
    .then(res => res.data);
};


export const fetchMyProfile = async () =>
  await privateApi.get("/userprofile/getMyProfile").then(res => res.data);

export const updateMyProfile = async (data) =>
  await privateApi.put("/userprofile/updateMyProfile", data).then(res => res.data);


