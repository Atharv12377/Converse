import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
   participants:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,

   }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }, //This lastMessage, we will set it ourself manually after sending each message and will also update the updatedat simultaneously ourself. 
    //User sends a message

// Inside my sendMessage controller I will:

// Create message doc
// Get its _id
// Update the conversation
// then do:
    //conversation.lastMessage = newMessage._id
    // conversation.updatedAt = Date.now()
    // save()
    //Something like this while sending each message and creating message doc. So the conversation document always has the id of latest message.
  },
  { timestamps: true }
);
conversationSchema.pre('save', function(){
  this.participants.sort()
})
conversationSchema.index(
  { "participants.0": 1, "participants.1": 1 },
  { unique: true }
)
conversationSchema.index({ updatedAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
