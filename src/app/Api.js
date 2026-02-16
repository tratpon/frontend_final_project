import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const fetchRooms = () => api.get('/rooms').then(res => res.data.rooms);
export const createRoom = (data) => api.post('/rooms', data).then(res => res.data);
export const joinRoom = (roomId, name) => api.post(`/rooms/${roomId}/join`, { participantName: name }).then(res => res.data);



export const fetchTypes = () => api.get('/service').then(res => res.data.types);
export const fetchAllService = () => api.get('/service/getlist').then(res => res.data);
export const fetchDetailService = (id) => api.get(`/service/getdetail/${id}`).then(res => res.data);
export const fetchfilterService = (TypesName, keyword) => api.get(`/service/getFillter?TypesName=${encodeURIComponent(TypesName)}&keyword=${keyword}`).then(res => res.data);














