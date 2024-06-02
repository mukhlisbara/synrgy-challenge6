import  User  from "../models/User.js";
import bcrypt from "bcrypt";

const data = [ 
    {
        username: 'SuperAdminBara',
        email: 'superadmin@gmail.com',
        password: '123123',
        role: 'SuperAdmin'

    }
]

export const UserSeeder = async () => {
    data.map( async (userNew) => {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(userNew.password, salt);

        await User.create({
            username: userNew.username,
            email: userNew.email,
            password: hashPassword,
            role: userNew.role
        })
    })
}