import fs from 'fs'
import { utilService } from '../../services/util.service.js'


let users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}

const PAGE_SIZE_FOR_USERS = 5

async function query(filterBy) {
  
    try {
        let usersToFilter = [...users]
        if (filterBy.fullname) {
            const regExp = new RegExp(filterBy.fullname, 'i')
            usersToFilter = usersToFilter.filter(user => regExp.test(user.fullname))
        }
        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE_FOR_USERS
            usersToFilter = usersToFilter.slice(startIdx, startIdx + PAGE_SIZE_FOR_USERS)
        }
        return usersToFilter

    } catch (err) {
        loggerService.error('Had problems getting users')
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw `User not found by userId : ${userId}`
        return user
    } catch (err) {
        loggerService.error('userService[getById] : ', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Couldn't find user with _id ${causerIdrId}`

        users.splice(idx, 1)
        await _saveUsersToFile()
    } catch (err) {
        loggerService.error('userService[remove] : ', err)
        throw err
    }
}



async function save(user) {
    try {
        if (user._id) {
            const idx = users.findIndex(userInDb => userInDb._id === user._id)
            if (idx === -1) throw 'Bad Id'
            users.splice(idx, 1, user)
        } else {
            // ADD for now
            user._id = utilService.makeId()
            user.score = 10000
            user.createdAt = Date.now()
            if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
            users.push(user)
        }
        await _saveUsersToFile()
        return user
    } catch (err) {
        loggerService.error('userService[save] : ', err)
        throw err
    }
}


async function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return user
}



function _saveUsersToFile() {
    return new Promise((resolve, reject) => {

        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}

