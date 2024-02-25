//import fs from 'fs'
import { utilService } from './../../services/util.service.js';
import { dbService } from '../../services/db.service.js';
import { ObjectId } from 'mongodb'
import { asyncLocalStorage } from '../../services/als.service.js';
import { loggerService } from '../../services/logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    add,
    update,
}

const collectionName = 'bug'
const PAGE_SIZE = 3

async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const sortCriteria = _buildSortCriteria(filterBy)
        console.log('criteria', criteria)

        const collection = await dbService.getCollection(collectionName)
        const bugCursor = await collection.find(criteria).sort(sortCriteria)

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugCursor.skip(startIdx).limit(PAGE_SIZE)
        }

        const bugs = await bugCursor.toArray()
        return bugs

    } catch (err) {
        loggerService.error('Had problems getting bugs')
        throw err
    }

}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const bug = await collection.findOne({ _id: new ObjectId(bugId) })
        if (!bug) {
            console.log('could not find bug')
            throw `Couldn't find bug with _id ${bugId}`
        }
        return bug
    } catch (err) {
        loggerService.error(`while finding bug ${bugId}`, err)
        throw err
    }
}


async function remove(bugId, loggedinUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const bugToDelete = await collection.findOne({ _id: new ObjectId(bugId) })
        /*only the creator or an admin can delete the bug */
        if (!loggedinUser.isAdmin && (bugToDelete.creator._id !== loggedinUser._id)) {
            console.log(`${loggedinUser._id} is trying to remove bu ${bugToDelete.creator._id} `)
            throw { msg: `Not your bug`, code: 403 }
        }

        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(bugId) })
        return deletedCount
    } catch (err) {
        loggerService.error(`cannot remove bug ${bugId}`, err)
        throw err
    }
}


async function add(bugToSave, loggedinUser) {
    try {
        // carToSave.owner ={_id: new ObjectId(loggedinUser._id), fullname:}
        bugToSave.creator = loggedinUser
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(bugToSave)
        bugToSave.createdAt = new ObjectId(bugToSave._id).getTimestamp()
        return bugToSave
    } catch (err) {
        loggerService.error('bugService, can not add bug : ' + err)
        throw err
    }
}

async function update(bug, loggedinUser) {
    try {

        const collection = await dbService.getCollection(collectionName)

        const bugToUpdate = await collection.findOne({ _id: new ObjectId(bug._id) })
        /*only the creator or an admin can update the bug */
        if (!loggedinUser.isAdmin && (bugToUpdate.creator._id !== loggedinUser._id)) {
            console.log(`${loggedinUser._id} is trying to remove bu ${bugToUpdate.creator._id} `)
            throw { msg: `Not your bug`, code: 403 }
        }

        // Take only updatable fields
        const bugToSave = {
            title: bug.title,
            description: bug.description,
            severity: bug.severity
        }
        const res = await collection.updateOne({ _id: new ObjectId(bug._id) }, { $set: bugToSave })
        console.log('res', res)
        return bug
    } catch (err) {
        loggerService.error(`cannot update bug ${bug._id}`, err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.txt) {
        criteria.title = { $regex: filterBy.txt, $options: 'i' }
    }

    if (filterBy.description) {
        criteria.description = { $regex: filterBy.description, $options: 'i' }
    }


    if (filterBy.minSeverity) {
        criteria.severity = { $gt: filterBy.minSeverity }
    }
    
    if (filterBy.userId) {
        criteria['creator._id'] = { $regex: filterBy.userId, $options: 'i'}
    }

    return criteria
}


function _buildSortCriteria(filterBy) {
    const sortCriteria = {}
    if (filterBy.sortBy) {
        // MongoDB sort criteria: 1 for ascending, -1 for descending
        switch (filterBy.sortBy) {
            case 'title':
                sortCriteria.title = 1
                break;
            case 'severity':
                sortCriteria.severity = 1
                break;
            case 'createdAt':
                sortCriteria._id = -1
                break
        }
    }
    console.log(sortCriteria)
    return sortCriteria
}