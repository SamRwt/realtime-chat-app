import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days in milliseconds
        httpOnly: true,         // ??
        sameSite: true,          // ??
        secure: process.env.NODE_ENV === "production",
    });

    return token;
};
