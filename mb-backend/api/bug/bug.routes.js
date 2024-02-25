import express  from "express"
import { addBug, getBug, getBugs, removeBug, updateBug } from "./bug.controller.js"
import { requireUser } from "../../middlewares/requireAuth.middleware.js"
//import { requireUser } from '../../middlewares/requireAuth.middleware.js'
// import { requireAuth } from '../../middlewares/requireAuth.middleware.js'


const router = express.Router()


router.get('/', getBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId', requireUser, removeBug)
router.post('/', requireUser, addBug)
router.put('/', requireUser, updateBug)

export const bugRoutes = router
