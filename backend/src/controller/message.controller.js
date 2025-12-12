import { Message } from "../models/message.model.js";
import { Conversation } from "../models/Conversation.model.js";
import User from "../models/user.model.js"


export const getAllChats = async (req,res) =>{
    try{
    const loggedInUserId = req.user._id;
    if(!loggedInUserId){
        throw new Error("The user is not logged in")
    }
    const chats = await Conversation.find({participants: {$in: [loggedInUserId]}}).sort({updatedAt:-1}).populate('lastMessage').populate("participants")

    if(chats.length === 0){
        return res.status(200).json({
            Chats: [],
            Message: "No Existing Chats, Start Chatting"
        })
    }
    res.json({
        Chats: chats,
    })
}
catch(err){
    res.status(400).json({
        message: "Error In Fetching the chats. Please try again.",
        error: err.message
    })
}
}

export const SearchPeople = async (req,res) =>{
    try{
    const {firstName,lastName} = req.query;

    if(!firstName && !lastName){
        return res.status(400).json({
            message: "Enter a name to search"
        })
    }
    const Users = await User.find(
       {$or:[
        {firstName: firstName},
        {lastName: lastName}
       ]});
    if(Users.length === 0){
        return res.status(404).json({
            message: "No User Found"
        })
    }
    res.json({
        userData: Users
    })
}
catch(err){
    res.status(404).json({
        message: "Error While Finding User, Try Again",
        error: err.message
    })
}
}

export const createConversation = async(req,res) =>{
    try {
        console.log(req.user);
        const firstParticipant = req.user._id;
        const secondParticipant = req.body.secondParticipant; //This we will get when we search a person, we click on him, the frontend will save the id and send it here.
        if(!secondParticipant){
            throw new Error("Second Participant is Required")
        }  
        if(firstParticipant.toString() === secondParticipant.toString()){
            throw new Error("Cannot Start Conversation with the same Person.")
        }
        const secondParticipantData = await User.findById(secondParticipant) 
        if(!secondParticipantData){
            return res.status(404).json({
                message: "User Not Found in Conversations"
            })
        }
        const isExistingConversation = await Conversation.findOne({
            participants: {$all: [firstParticipant, secondParticipant]}
        })
        if(!isExistingConversation){
            //We create a new conversation and store it.
            const newConversation = new Conversation({
                participants: [firstParticipant, secondParticipant],
                lastMessage: undefined,
            })
            const savedConversation = await newConversation.save()
            return res.status(201).json({
                Conversation: {
                    isNew : true, 
                    ConversationId: savedConversation._id,
                    firstParticipant: {
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        photoUrl: req.user.photoUrl || "",
                    },
                    secondParticipant: {
                        firstName: secondParticipantData.firstName,
                        lastName: secondParticipantData.lastName,
                        photoUrl: secondParticipantData.photoUrl || ""
                    }
                }
            })

        }
        else{
            return res.status(200).json({
                isNew: false,
                Conversation: {
                    ConversationId: isExistingConversation._id,
                    firstParticipant: {
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        photoUrl: req.user.photoUrl || "",
                    },
                    secondParticipant: {
                        firstName: secondParticipantData.firstName,
                        lastName: secondParticipantData.lastName,
                        photoUrl: secondParticipantData.photoUrl || ""
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Error while Creating Conversation",
            Error: error.message
        })
    }
}
