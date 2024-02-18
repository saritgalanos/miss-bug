import { bugService } from "./bug.service.js"

//List
export async function getBugs(req, res) {
    try {
         let filterBy = {
            txt: req.query.txt || '',
            minSeverity: +req.query.minSeverity || 0,
            description: req.query.description || '',
            pageIdx: req.query.pageIdx || undefined,
            sortBy: req.query.sortBy || '',
            userId: req.query.userId || ''
        }
        if (filterBy.pageIdx !== undefined) filterBy.pageIdx = +filterBy.pageIdx
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`couldn't get bugs`)
    }
}


//Get
export async function getBug(req, res) {

    
    var { bugId } = req.params
        
    let visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : [];
    
    
    if (visitedBugs.includes(bugId)) {
        // Bug already visited, not adding to the count
    } else if (visitedBugs.length < 10) {
        visitedBugs.push(bugId);
    } else {
        // User has visited 3 or more different bugs, return an error
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000, httpOnly: true });
        return res.status(401).send('Wait for a bit')
    }

    // Update the cookie with the new visitedBugs array, make it last for 7 seconds
    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { httpOnly: true })
    console.log(`User visited the following bugs: ${visitedBugs.join(', ')}`)

    try {
        const bug = await bugService.getById(bugId, req.loggedinUser)
        res.send(bug)
    } catch (err) {
        res.status(400).send(`couldn't get bug`)
    }
}

//Delete
export async function removeBug(req, res) {
    var { bugId } = req.params
    console.log (`user ${req.loggedinUser} is trying to remove bug id: ${bugId}`)
    try {
        const response = await bugService.remove(bugId, req.loggedinUser)
        res.send(response)
    } catch (err) {
        res.status(400).send(`Couldn't remove bug - ${err}`)
    }
}

//Save
export async function addBug(req, res) {
    const { title, severity, description, createdAt } = req.body
    const bugToSave = { title, description, severity: +severity, createdAt: +createdAt }
    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`couldn't save bug -  ${err}`)
    }

}

//Update
export async function updateBug(req, res) {

    const { _id, title, severity, description, createdAt , creator } = req.body
    const bugToSave = { _id, title, description, severity: +severity, createdAt: +createdAt, creator }
    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        console.log(err)
        res.status(400).send(`couldn't update bug -  ${err}`)
    }

}


