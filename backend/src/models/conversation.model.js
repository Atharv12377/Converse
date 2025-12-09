import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);
conversationSchema.index({ senderId: 1, receiverId: 1 });
conversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
