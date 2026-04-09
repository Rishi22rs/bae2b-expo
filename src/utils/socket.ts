import { io } from "socket.io-client";
import { baseURLSocket } from "../constants/api";
import { getJwtToken } from "./getJwtToken";

const socket = io(baseURLSocket, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocketWithAuth = async () => {
  const jwtToken = await getJwtToken();

  socket.auth = {
    token: jwtToken ? `Bearer ${jwtToken}` : "",
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export default socket;
