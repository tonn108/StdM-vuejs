import express from 'express'
import { getUsers, getUserById, createUser, updateUser, deleteUser, getUserProfile } from '../controllers/userController.js'
import { authenticateToken } from '../middleware/auth.js'
import { checkRole } from '../middleware/checkRole.js'

const router = express.Router()

// ท้องวาง specific routes ก่อน
router.get('/profile', authenticateToken, checkRole(['admin' , 'teacher']), getUserProfile)

// ตามด้วย general routes
router.get('/', authenticateToken, checkRole(['admin']), getUsers)
router.post('/', authenticateToken, checkRole(['admin']), createUser)

// dynamic routes ต้องอยู่หลังสุด
router.get('/:id', authenticateToken, checkRole(['admin']), getUserById)
router.put('/:id', authenticateToken, checkRole(['admin']), updateUser)
router.delete('/:id', authenticateToken, checkRole(['admin']), deleteUser)

export default router 