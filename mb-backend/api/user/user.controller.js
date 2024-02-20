import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        let filterBy = {
            fullname: req.query.fullname || '',
            pageIdx: req.query.pageIdx || undefined
        } 
        if (filterBy.pageIdx !== undefined) filterBy.pageIdx = +filterBy.pageIdx
        console.log('in server get users:',filterBy)
        
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function updateUser(req, res) {

    const user = req.body
    const { _id, username, fullname, password, score } = req.body
    const userToSave = { _id, username, fullname, password, score: +score }
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}


export async function addUser(req, res) {
    console.log(req.body)

    const { username, fullname, password, score } = req.body
    const userToSave = { username, fullname, password, score: +score }
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(`couldn't save user`)
    }

}