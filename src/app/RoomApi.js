import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const fetchRooms = () => api.get('/rooms').then(res => res.data.rooms);
export const createRoom = (data) => api.post('/rooms', data).then(res => res.data);
export const joinRoom = (roomId, name) => api.post(`/rooms/${roomId}/join`, { participantName: name }).then(res => res.data);



















