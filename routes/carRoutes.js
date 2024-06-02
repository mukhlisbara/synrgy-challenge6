import express from 'express'
import { createCars, deleteCars, getDetailCar, listCars, updateCars } from '../controllers/CarController.js';
import upload from '../middleware/upload.js';
import { GeneralAuth } from '../middleware/Auth.js';
import { AdminAuth } from '../middleware/AdminAuth.js';

const router = express.Router();

router.get('/cars', GeneralAuth, listCars)
router.get('/cars/:id', GeneralAuth, getDetailCar)
router.post('/cars', AdminAuth, upload.single('image'), createCars);
router.put('/cars/:id', AdminAuth, upload.single('image'),  updateCars)
router.delete('/cars/:id', AdminAuth, deleteCars)

export default router;