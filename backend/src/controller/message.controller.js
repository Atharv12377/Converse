import { Message } from "../models/message.model.js";
import { Conversation } from "../models/Conversation.model.js";
import User from "../models/user.model.js";


export const getAllChats = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    if (!loggedInUserId) {
      throw new Error("The user is not logged in");
    }
    const chats = await Conversation.find({
      participants: { $in: [loggedInUserId] },
    })
      .sort({ updatedAt: -1 })
      .populate({ path: "lastMessage", select: "senderId type message" })
      .populate({
        path: "participants",
        select: "_id firstName lastName photoUrl",
      });

    if (chats.length === 0) {
      return res.status(200).json({
        Chats: [],
        Message: "No Existing Chats, Start Chatting",
      });
    }
    res.json({
      Chats: chats,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error In Fetching the chats. Please try again.",
      error: err.message,
    });
  }
};

export const SearchPeople = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName && !lastName) {
      return res.status(400).json({
        message: "Enter a name to search",
      });
    }
    const Users = await User.find({
      $or: [{ firstName: firstName || firstName }, { lastName: lastName || firstName }],
    });
    if (Users.length === 0) {
      return res.status(404).json({
        message: "No User Found",
      });
    }
    res.json({
      userData: Users,
    });
  } catch (err) {
    res.status(404).json({
      message: "Error While Finding User, Try Again",
      error: err.message,
    });
  }
};

export const createConversation = async (req, res) => {
  try {
    console.log(req.user);
    const firstParticipant = req.user._id;
    const secondParticipant = req.body.secondParticipant; //This we will get when we search a person, we click on him, the frontend will save the id and send it here.
    if (!secondParticipant) {
      throw new Error("Second Participant is Required");
    }
    if (firstParticipant.toString() === secondParticipant.toString()) {
      throw new Error("Cannot Start Conversation with the same Person.");
    }
    //This is the second participant data fetching, ye req body me jo id hai usse data fetch kiya hai to attach in response.
    const secondParticipantData = await User.findById(secondParticipant);
    if (!secondParticipantData) {
      return res.status(404).json({
        message: "User Not Found in Conversations",
      });
    }
    const isExistingConversation = await Conversation.findOne({
      participants: { $all: [firstParticipant, secondParticipant] },
    });
    if (!isExistingConversation) {
      //We create a new conversation and store it.
      const newConversation = new Conversation({
        participants: [firstParticipant, secondParticipant],
        lastMessage: undefined,
      });
      const savedConversation = await newConversation.save();
      return res.status(201).json({
        Conversation: {
          isNew: true,
          ConversationId: savedConversation._id,
          firstParticipant: {
            firstParticipantUserId: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            photoUrl: req.user.photoUrl || "",
          },
          secondParticipant: {
            secondParticipantUserId: secondParticipantData._id,
            firstName: secondParticipantData.firstName,
            lastName: secondParticipantData.lastName,
            photoUrl: secondParticipantData.photoUrl || "",
          },
        },
      });
    } //Idhar first participant is the once which is logged in. Therefore req.user.__ since we attach the loggedin user's details to the req object in auth middleware.
    else {
      return res.status(200).json({
        isNew: false,
        Conversation: {
          ConversationId: isExistingConversation._id,
          firstParticipant: {
            firstParticipantUserId: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            photoUrl: req.user.photoUrl || "",
          },
          secondParticipant: {
            secondParticipantUserId: secondParticipantData._id,
            firstName: secondParticipantData.firstName,
            lastName: secondParticipantData.lastName,
            photoUrl: secondParticipantData.photoUrl || "",
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    // if(error.code === 11000){
    //     const Conversation = await Conversation.findOne({
    //     participants: {$all: [firstParticipant, secondParticipant]}
    // })
    // } We can do this for a case when suppose, two people hit the api at the same time, since we have participant as unique, onle will get a 500 error and one will get a 11000 error which is of duplicate item not allowed sort of error. This case can happen if two people hit the api on the same time, in like, miliiseconds. This is idempotency

    res.status(500).json({
      message: "Error while Creating Conversation",
      Error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const conversationId = req.params.conversationId;
    console.log(conversationId);
    const isValidConversation = await Conversation.findOne({
      _id: conversationId,
      participants: { $in: [loggedInUserId] },
    });
    if (!isValidConversation) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: -1 })



    if (messages.length === 0) {
      return res.status(200).json({ messages: [] });
    }
    res.json({
      messages: messages,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Fetch Messages, Please Try again",
      error: error.message,
    });
  }
};
//I can add cursor Pagination here to get Messages. Bascially we would decide a cursor everytime we fetch suppose 20 msg, limit will be 20, and the new cursor would be from where the next 20 will start smth like that. 

export const sendMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const loggedInUserId = req.user._id;
    if (!conversationId || !loggedInUserId) {
      return res.status(400).json({
        message: "Conversation Or User Not Found, Please try again.",
      });
    }
    const isValidConversation = await Conversation.findOne({
      _id: conversationId,
      participants: { $in: [loggedInUserId] },
    });
    if (!isValidConversation) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    const {textMessage} = req.body;
    if (!textMessage && !req.file) {
      return res.status(400).json({
        message: "Enter a message",
      });
    }
    const typeofmessage = req.file ? "image" : "text";
    let imageUrl = req.file? req.file.path  : null; //Since we are using the multer-cloudinary-storage package, we dont need to upload the file using multer and then upload to cloudinary, it happens directly through that multer middleware. So the multer reads the file and uploads it to cloudinary directly, and doest store it in the local sys storage. No tension for temp file handeling. 
    const message = new Message({
      conversationId: conversationId,
      senderId: loggedInUserId,
      type: typeofmessage,
      message: textMessage,
      imageUrlCloudinary: imageUrl,
    });
    const savedmessage = await message.save();
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: savedmessage._id,
    });
    res.status(200).json({
      message: savedmessage,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Something went Wrong while sending the message",
      error: error.message,
    });
  }
};
