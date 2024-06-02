import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const SuperAdminAuth = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(" ")[1]

        const tokenPayload = jwt.verify(token, 'secret')
        
        req.user = await User.findByPk(tokenPayload.id);
        
        if (req.user.role == "SuperAdmin")
            next()  
        else {
            res.status(401).json({message: "Not authorized: you are not a SuperAdmin"})
        }
    } catch (err) {
        res.status(401).json({message: "Not authorized: you are not a SuperAdmin"})
    }
}