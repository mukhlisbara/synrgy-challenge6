import express from 'express'
import { currentUser, deleteUser, listUser, login, logout, registerUser, updateRole } from '../controllers/UserController.js';
import { GeneralAuth } from '../middleware/Auth.js';
import { SuperAdminAuth } from '../middleware/SuperAdminAuth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/user', GeneralAuth, currentUser)
router.post('/logout', GeneralAuth, logout)

// route untuk crud
router.get('/users', SuperAdminAuth, listUser)
router.put('/users/:id', SuperAdminAuth, updateRole)
router.delete('/users/:id', SuperAdminAuth, deleteUser)

export default router;
