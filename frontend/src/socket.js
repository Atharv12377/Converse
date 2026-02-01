import { io } from "socket.io-client" //WE use this io fxn to crete connec.

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL

let socket = null;

export const connectSocket = (userId) => {
    if (socket?.connected) {
        return socket
    }
    socket = io(BACKEND_BASE_URL, {
        withCredentials: true,
        query: { userId }
    })

    socket.on("connect", () => {
        console.log("Connected FtoB Socket Server ", socket.id);
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from the FtoB Socket Server ", socket.id)
    })
    socket.on("connect_error", (error) => {
        console.log("Error Connecting to FtoB Socket Server", error.message);
    });
    return socket;
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null
    }
}
export const getSocket = () => socket; //This is used by other components to 
// use the socket instance and do emit and listen for events.
export default socket; 
