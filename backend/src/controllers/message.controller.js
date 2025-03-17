import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const otherUsers = await User.find({ _id: { $ne: currentUserId } });
        res.status(200).json(otherUsers);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id : receiverId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        let imageLink;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageLink = uploadResponse.secure_url;
        }

        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageLink
        });

         await message.save();
        res.status(200).json(message);
        // TODO: socket.io
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};