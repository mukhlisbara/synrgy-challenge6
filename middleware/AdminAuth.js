import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const AdminAuth = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(" ")[1]

        const tokenPayload = jwt.verify(token, 'secret')
        
        req.user = await User.findByPk(tokenPayload.id);
        
        if (req.user.role == "SuperAdmin" || req.user.role == "Admin")
            next() 
        else {
            return res.status(401).json({message: "Not authorized: you aren't Admin or SuperAdmin"})
        } 
    } catch (err) {
        res.status(401).json({message: "Not authorized"})
    }
}