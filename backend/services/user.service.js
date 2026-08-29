import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const newUser = async({
    username,
    email,
    password,
    role
})=>{
    const  user  = await User.create({
        username: username || "",
        email: email || "",
        password,
        role

        })
        const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'mysecret');
        return {user , token};
    };
