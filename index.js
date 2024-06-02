import express from 'express';
import cors from 'cors'
import DB from './config/database.js';
import userRoutes from './routes/userRoutes.js'
import carRoutes from './routes/carRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express()
const PORT = process.env.PORT || 5000
process.env.TZ = 'ASIA/Jakarta' 

const __fileName = fileURLToPath(import.meta.url)
const __dirName = path.dirname(__fileName)

app.use(cors())
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(path.join(__dirName, "public")))

app.get('/', async (req, res) => {
    res.status(200).send("Welcome to BE")
})

// app.use('/apiUser', userRoutes)
// app.use('/apiCar', carRoutes )

app.use( userRoutes)
app.use( carRoutes )

app.listen(PORT, async () => {
    try {
        // await DB.authenticate()
        // await DB.sync()
        console.log('Connection has been established successfully.');
        console.log(`Server running on PORT ${PORT} at http://127.0.0.1:${PORT}`);
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }  
})