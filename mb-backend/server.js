import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'


const app = express()

// App configuration
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import {bugRoutes} from './api/bug/bug.routes.js'
import {userRoutes} from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { loggerService } from './services/logger.service.js'
import { msgRoutes } from './api/msg/msg.routes.js'

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/msg', msgRoutes)

app.get('/', (req, res) => res.send('Hello there'))

app.get('/**', (req, res) => {
    console.log('some msg received')
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    loggerService.info('Up and running on port ' + PORT)
})
