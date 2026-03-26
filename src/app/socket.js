import { io } from "socket.io-client";
import { getAuth } from "firebase/auth";

const web = import.meta.env.VITE_API_BASE_URL_SOCKET
const localhost = "http://localhost:3001"
export const createSocket = async () => {

  const auth = getAuth();

  const token = await auth.currentUser.getIdToken();

  const socket = io(web, {
    auth: { token }
  });

  return socket;
};