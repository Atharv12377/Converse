import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Conversation",
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    type: {
        type: String,
        required: true,
        enum: ["text", "image"]
    },
    message: {
        type: String,
    },
    imageUrlCloudinary: {
        type: String,
    }
}, {timestamps: true})
messageSchema.index({conversationId: 1, createdAt: -1})
export const Message = mongoose.model("Message", messageSchema)
