import express from 'express'
//import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { addMsg, getMsgs, deleteMsg } from './msg.controller.js'
import { requireAdmin, requireUser } from '../../middlewares/requireAuth.middleware.js'
const router = express.Router()

router.get('/', log, getMsgs)
router.post('/', log, requireUser, addMsg)
router.delete('/:id', requireAdmin, deleteMsg)

export const msgRoutes = router