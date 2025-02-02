import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User does not exists !!" });

        const isCorrectPassword = await bcrypt.compare(password, existingUser.password);

        if (!isCorrectPassword) return res.status(400).json({ message: "Invalid Credentials !!" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !!" });
    }
}

export const signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User Already Exists !" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match !!" });

        // const generateSalt = Math.floor(Math.random() * 101) + 1;

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong !!",error:error.message });
    }
}