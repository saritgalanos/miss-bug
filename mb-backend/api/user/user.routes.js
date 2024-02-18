import express from 'express'
import { getUser, getUsers, deleteUser, updateUser, addUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/', requireAdmin, updateUser)
router.post('/', requireAdmin, addUser)
router.delete('/:id', requireAdmin, deleteUser)

export const userRoutes = router