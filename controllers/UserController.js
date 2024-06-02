import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { match } from 'assert';

export const listUser = async (req, res) => {
    try {
        const users = await User.findAll()
        console.log(users)
        return res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}

export const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body

    if (password !== confirmPassword) 
        return res.status(400).json({message: "Ensure your password and confirm password correct"})

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.findOne({where: {email: email}})
        if (user !== null)
            return res.status(400).json({message: "Email has already registered, please use different email or login"})

        await User.create({
            username: username,
            email: email,
            password: hashPassword,
            role: role
        })

        return res.status(201).json({
            message: `User ${username} berhasil dibuat`,
            data: {
                name: username, 
                email: email
            }
        })
    } catch (err) {
        res.status(500).json({message: 'Error found: ' + err})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({where: {email: email}})

        if (user == null || user == undefined)
            res.status(400).json({message: "Email not found, please register first"})

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            res.status(400).json({message: 'Password incorrect!'})
        else {
            const accessToken = jwt.sign(
                { id: user.id, name: user.name, email: user.email, password: user.password},
                'secret',
                {expiresIn: '1d'}
            );
           await user.update({
            token: accessToken
           })

            const hoursExpired = 6;
            const gmt = 7
            const expiredAge = 1000 * 60 * 60 * (hoursExpired + gmt);
            res.cookie("accessToken", accessToken, {httpOnly: true, maxAge: expiredAge })
        }

        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}

export const logout = async (req, res) => {
    try {
        const user = await User.findOne({where: {email: req.user.email}})

        if (!user)
            res.status(400).json({message: "Email not found, please register first"})
        
        await user.update({
            token: ""
        })

        res.cookie("accessToken", '', {httpOnly: true, maxAge: 1 })

        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}

export const currentUser = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}

export const updateRole = async (req, res) => {
    const {id} = req.params;
    const {role} = req.body;

    try {
        const user = await User.findByPk(id)
        if (!user)
            return res.status(400).json({message: "User Not Found! check your data payload please"})

        user.role = role
        await user.save()

        return res.status(200).json({message: "Data user have been updated", user})
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findByPk(id)
        if (!user)
            return res.status(400).json({message: "User Not Found! check your data payload please"})

        await user.destroy()
        return res.status(200).json({message: "Data user have been deleted", user})
    } catch (err) {
        res.status(500).json({ message: 'Error Found: ' + err })
    }
}