import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
//import { reviewService } from '../review/review.service.js'
import { utilService } from '../../services/util.service.js'

import mongodb from 'mongodb'
const { ObjectId } = mongodb
const collectionName = 'user'


export const userService = {
    query,
    getById,
    remove,
    getByUsername,
    update,
    add
}


// import fs from 'fs'
// let users = utilService.readJsonFile('data/user.json')


const PAGE_SIZE_FOR_USERS = 5

async function query(filterBy={}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection(collectionName)
        console.log(collection)
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = new ObjectId(user._id).getTimestamp()
                // Returning fake fresh data
                // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })

        //console.log(users)
        return users

    } catch (err) {
        loggerService.error('Had problems getting users')
        throw err
    }
}

async function getById(userId) {
    try {
        console.log('user.service getById for user:',userId)
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password

        // user.givenReviews = await reviewService.query({ byUserId: new ObjectId(user._id) })
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })
               
        return user
    } catch (err) {
        loggerService.error(`error userService[getById] for user  ${userId}:`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.deleteOne({ _id: new ObjectId(userId) })
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err
    }
}



// async function save(user) {
//     try {
//         if (user._id) {
//             const idx = users.findIndex(userInDb => userInDb._id === user._id)
//             if (idx === -1) throw 'Bad Id'
//             users.splice(idx, 1, user)
//         } else {
//             // ADD for now
//             user._id = utilService.makeId()
//             user.score = 10000
//             user.createdAt = Date.now()
//             if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
//             users.push(user)
//         }
//         await _saveUsersToFile()
//         return user
//     } catch (err) {
//         loggerService.error('userService[save] : ', err)
//         throw err
//     }
// }



async function update(user) {
    try {
        // peek only updatable properties
        const userToSave = {
            _id: new ObjectId(user._id), // needed for the returnd obj
            fullname: user.fullname,
            score: user.score,
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            score: 100
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        loggerService.error('cannot add user', err)
        throw err
    }
}



async function getByUsername(username) {
    try {
        console.log('getByUsername')
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        loggerService.error(`while finding user by username: ${username}`, err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.fullname) {
        criteria.fullname = { $regex: filterBy.fullname, $options: 'i' }
    }
    // if (filterBy.txt) {
    //     const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    //     criteria.$or = [{
    //             username: txtCriteria
    //         },
    //         {
    //             fullname: txtCriteria
    //         }
    //     ]
    // }
    console.log('criteria:', criteria)
    return criteria
}

