import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).send("All fields are required");
    }
    try {
        if (password.length < 8) {
            return res.status(400).send("Password must be at least 8 characters long");
        }

        const user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).send("User already exists");
        };
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).send("Invalid user data");
        }
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("All fields are required");
    }
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(404).send("Invalid email or password");
        }
        const passCorrect = await bcrypt.compare(password, user.password);
        if (!passCorrect) {
            return res.status(404).send("Invalid email or password");
        }
        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).send("User logged out");
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).send("Profile picture required");
        }
        const uploaded = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploaded.secure_url     // url provided by cloudinary
        }, {new: true});

        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("internal error", error);
        return res.status(500).send(error.message);
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("internal error", error);
        return res.status(500).send(error.message);
    }
};