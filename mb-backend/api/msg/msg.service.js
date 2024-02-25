import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb



export const msgService = {
    query,
    remove,
    add
}


async function query(filterBy = {}) {
    try {
       
        const criteria = _buildCriteria(filterBy)
        // const pipeline = _buildPipeline(filterBy)
        const collection = await dbService.getCollection('msg')
        //const msgs = await collection.find(criteria).toArray()
       

        var msgs = await collection.aggregate([{
            $match: criteria
        },
        {
            $lookup: {
                from: 'user',
                localField: 'byUserId',
                foreignField: '_id',
                as: 'byUser'
            }
       },
        {
            $unwind: '$byUser'
        },
        {
             $lookup: {
                 localField: 'aboutBugId',
                 from: 'bug',
                 foreignField: '_id',
                 as: 'aboutBug'
             }
         },
         {
             $unwind: '$aboutBug'
        },
        {
            $project: {
                _id: true, // Include the '_id' field
                txt: true, // Include the 'txt' field
                "byUser._id": true, // Include 'byUser._id'
                "byUser.fullname": true, // Include 'byUser.fullname'
                "aboutBug._id": true, // Include 'aboutUser._id'
                "aboutBug.title": true, // Include 'aboutUser.fullname'
                "aboutBug.severity": true
            }
        }
        ]).toArray()
       
       
       
        // reviews = reviews.map(review => {
        //     review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
        //     review.aboutUser = { _id: review.aboutUser._id, fullname: review.aboutUser.fullname }
        //     delete review.byUserId
        //     delete review.aboutUserId
        //     return review
        // })

        return msgs
    } catch (err) {
        loggerService.error('cannot find msgs', err)
        throw err
    }

}

async function remove(msgId, loggedinUser) {
    try {
        const collection = await dbService.getCollection('msg')

        // getById
        // remove only if user is owner/admin
        const criteria = { _id: new ObjectId(msgId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = new ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        if (deletedCount < 1) {
            throw 'Cannot remove msg, not yours'
        }
        return deletedCount
    } catch (err) {
        loggerService.error(`cannot remove msg ${msgId}`, err)
        throw err
    }
}


async function add(msg) {
    try {
        const msgToAdd = {
            byUserId: new ObjectId(msg.byUserId),
            aboutBugId: new ObjectId(msg.aboutBugId),
            txt: msg.txt
        }
        const collection = await dbService.getCollection('msg')
        await collection.insertOne(msgToAdd)
        return msgToAdd
    } catch (err) {
        loggerService.error('cannot insert msg', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = new ObjectId(filterBy.byUserId)
    if(filterBy.aboutBugId) criteria.aboutBugId = new ObjectId(filterBy.aboutBugId)
    console.log(criteria)
    return criteria
}

