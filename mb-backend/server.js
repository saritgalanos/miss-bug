import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()


const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


import {bugRoutes} from './api/bug/bug.routes.js'
import {userRoutes} from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { loggerService } from './services/logger.service.js'

app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)



app.get('/puki', (req, res) => {
    let visitCount = +req.cookies.visitCount
    console.log(visitCount);
    res.cookie('visitCount', visitCount + 1 || 1)
    //res.cookie('visitCount', 1)
    res.send(`<h1>Hi Puki</h1>`)
})


app.get('/', (req, res) => res.send('Hello there'))

app.get('/**', (req, res) => {
    console.log("hi there")
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    loggerService.info('Up and running on port ' + PORT)
})
//app.listen(3030, () => console.log('Server ready at port 3030'))
