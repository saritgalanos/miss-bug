import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const PAGE_SIZE = 3

var bugs = _readJsonFile('./data/bug.json')

async function query(filterBy) {
    try {
       
        let bugsToFilter = [...bugs]
        if(filterBy.userId) {

            const regExp = new RegExp(filterBy.userId, 'i')
            bugsToFilter = bugsToFilter.filter(bug => regExp.test(bug.creator._id))
        }

        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugsToFilter = bugsToFilter.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.description) {
            const regExp = new RegExp(filterBy.description, 'i')
            bugsToFilter = bugsToFilter.filter(bug => regExp.test(bug.description))
        }

        if (filterBy.minSeverity) {
            console.log(filterBy.minSeverity)
            bugsToFilter = bugsToFilter.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        if (filterBy.sortBy) {
            switch (filterBy.sortBy) {
                case 'title':

                    bugsToFilter.sort((a, b) => {
                        if (a.title === null && b.title === null) return 0; // Both titles are null, considered equal
                        if (a.title === null) return 1 // Null titles sorted to end
                        if (b.title === null) return -1 // Null titles sorted to end
                        return a.title.localeCompare(b.title)
                    })

                    break
                case 'severity':
                    bugsToFilter.sort((a, b) => {
                        if (a.severity === null && b.severity === null) return 0; // Both titles are null, considered equal
                        if (a.severity === null) return 1 // Null titles sorted to end
                        if (b.severity === null) return -1 // Null titles sorted to end
                        return a.severity - b.severity
                    })
                    break
                case 'createAt':
                    bugsToFilter.sort((a, b) => {
                        return a.createdAt - b.createdAt
                    })
                    break
            }


        }


        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToFilter = bugsToFilter.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return bugsToFilter

    } catch (err) {
        loggerService.error('Had problems getting bugs')
        throw err
    }

}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        return bug
    } catch (err) {
        loggerService.error(`Had problems getting bug ${bugId}...`)
        throw err
    }
}

async function remove(bugId, loggedinUser) {
    try {
       
        //console.log(`${loggedinUser._id} is trying to remove bu ${bug.creator._id} `)
        const idx = bugs.findIndex(bug => bug._id === bugId)
        console.log("remove bug:"+idx)
        if (idx === -1) throw `Couldn't find bug with _id ${bugId}`

        console.log(bugs)
        const bug = bugs[idx]
        console.log("found bug in db:", bug)
        if (!loggedinUser.isAdmin && (bug.creator._id !== loggedinUser._id))
        {
            console.log(`${loggedinUser._id} is trying to remove bu ${bug.creator._id} `)
            throw { msg: `Not your bug`, code: 403 }
        }
        bugs.splice(idx, 1)
        await _saveBugsToFile('./data/bug.json')

    } catch (err) {
        loggerService.error(`Had problems removing bug ${bugId}...`)
        throw err
    }

    return `Bug ${bugId} removed`
}

async function save(bugToSave, loggedinUser) {
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw 'Bad Id'
            console.log('trying to update bug for user:'+loggedinUser._id)
            /*allow update only to admin and creator*/
            const bug = bugs[idx]
            if (!loggedinUser?.isAdmin && (bug.creator._id !== loggedinUser?._id)) {
              console.log("not your bug")
                throw `Not your bug`
            }
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = _makeId()
            bugToSave.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        _saveBugsToFile('./data/bug.json')
    } catch (err) {
        loggerService.error(`Had problems saving bug ${bugToSave._id}...`)
        throw err
    }
    return bugToSave
}

function _makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function _readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function _saveBugsToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}