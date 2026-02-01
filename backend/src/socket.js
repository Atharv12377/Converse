import { Server, Socket } from "socket.io";
import dotenv from "dotenv"
dotenv.config()
let io;
const FRONTEND_URL = process.env.FRONTEND_URL
const userSocketMap = {};

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: FRONTEND_URL,
            credentials: true,
        }
    })
    io.on("connection", (socket) => {
        console.log("User Connected", socket.id);

        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap[userId] = socket.id;
            console.log(`${userId} connected with the socket id ${socket.id}`)
        };

        socket.on("joinRoom", (conversationId) => {
            socket.join(conversationId);
            console.log(`Socket ${socket.id} joined room: ${conversationId}`)
        });

        socket.on("leaveRoom", (conversationId) => {
            socket.leave(conversationId);
            console.log(`Socket ${socket.id} left room: ${conversationId}`);
        });

        socket.on("sendMessage", (data) => {
            const { conversationId, message } = data;
            io.to(conversationId).emit("receiveMessage", message);
            console.log(`Message Brodcasted to room ${conversationId}`)
        });

        socket.on("typing", (data) => {
            socket.to(data.conversationId).emit("userTyping", {
                firstName: data.firstName,
                lastName: data.lastName,
                isTyping: true
            });
        });

        socket.on("stopTyping", (data) => {
            socket.to(data.conversationId).emit("userTyping", {
                firstName: data.firstName,
                lastName: data.lastName,
                isTyping: false
            });
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected : ", socket.id);
            for (const [uId, sId] of Object.entries(userSocketMap)) {
                if (sId === socket.id) {
                    delete userSocketMap[uId];
                    break;
                }
            }
        })
    });
    return io;
}
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized");
    }
    return io;
}
export { userSocketMap }


