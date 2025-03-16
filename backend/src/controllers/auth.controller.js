import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";

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

export const login = (req, res) => {
    res.send("Login route");
};

export const logout = (req, res) => {
    res.send("Logout route");
}

