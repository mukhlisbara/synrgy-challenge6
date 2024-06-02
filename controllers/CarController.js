import Car from "../models/Car.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import User from "../models/User.js";

const baseFolder = `/public/uploads`
const __filename = fileURLToPath(import.meta.url)
const __dirnameFile = path.dirname(__filename)
const __dirnameRoot = path.dirname(__dirnameFile)

export const listCars = async (req, res) => {
    try {
        const cars = await Car.findAll({paranoid: false})
        return res.status(200).json(cars)
    } catch (err) {
        res.status(500).json({message: "Error Found: " + err})
    }
}

export const getDetailCar = async (req, res) => {
    const {id} = req.params;

    try {
        const car = await Car.findByPk(id, {paranoid: false})
        if (car == undefined || car == null)
            return res.status(400).json({message: "Car Not Found!"})

        return res.status(200).json(car)
    } catch (err) {
        res.status(500).json({message: "Error Found: " + err})
    }
}

export const createCars = async (req, res) => {
    try{
        const url = `${baseFolder}/${req.file.filename}`;
        req.body["image"] = url
        console.log(req.user.username)
       
        const creator = {
            created_by: req.user.username,
            updated_by: req.user.username
        }

        await Car.create({
            ...req.body,
            ...creator,
        })

        res.status(201).json({message: "New Car successful created"})

    } catch (err) {
        res.status(500).json({message: "Error Found: " + err})
    }
}

export const updateCars = async (req, res) => {
    const {id} = req.params
    
    try {
        const car = await Car.findByPk(id)

        if (car == null || car == undefined)
            return res.status(400).json({message: "Car Not Found!"})
        
        if (req.file !== undefined && car.image != req.body.image) {
            fs.unlink(path.join(__dirnameRoot, car.image), (err) => {
                if(err) {
                    return res.status(500).send({
                        message: "Could not delete the file. " + err
                    })
                }

                const url = `${baseFolder}/${req.file.filename}`;
                req.body["image"] = url
            })
        }

        req.body["updated_by"] = req.user.username

        await car.update(req.body)
        return res.status(201).json(car)
    } catch (err) {
        res.status(500).json({message: "Error Found: " + err})
    }
}

export const deleteCars = async (req, res) => {
    const {id} = req.params 
    
    try {
        const car = await Car.findByPk(id)
        if (!car) 
            return res.status(400).json({message: "Car not found, check your payload please."})
        
        fs.unlink(path.join(__dirnameRoot, car.image), (err) => {
            if(err) {
                return res.status(500).send({
                    message: "Could not delete the file. " + err
                })
            }
        })

        car["deleted_by"] = req.user.username
        await car.save()

        await car.destroy()

        return res.status(201).json({message: "Car have been destroyed"})
    } catch (err) {
        res.status(500).json({message: "Error Found: " + err})
    }
}