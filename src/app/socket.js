import { io } from "socket.io-client";
import { getAuth } from "firebase/auth";

export const createSocket = async () => {

  const auth = getAuth();

  const token = await auth.currentUser.getIdToken();

  const socket = io("http://localhost:3001", {
    auth: { token }
  });

  return socket;
};