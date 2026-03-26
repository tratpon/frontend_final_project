import axios from "axios";
import { auth } from "../firebase";

const web = import.meta.env.VITE_API_BASE_URL;
const localhost = "http://localhost:3001/api"

export const publicApi = axios.create({
  baseURL: web,
});

export const privateApi = axios.create({
  baseURL: web,
});

privateApi.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    console.log("from api token user",user)
    if (!user) {
      return Promise.reject("No user login");
    }

    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);