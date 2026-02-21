import axios from "axios";
import { auth } from "../firebase";


export const publicApi = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const privateApi = axios.create({
  baseURL: "http://localhost:3001/api",
});

privateApi.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (!user) {
      return Promise.reject("No user login");
    }

    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);