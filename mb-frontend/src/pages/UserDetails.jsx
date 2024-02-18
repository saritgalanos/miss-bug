import { useEffect, useState } from "react"
import { BugList } from "../cmps/BugList"
import { bugService } from "../services/bug.service"
import { showErrorMsg } from "../services/event-bus.service"

export function UserDetails() {
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
    const [bugs, setBugs] = useState([])

    useEffect(() => {
        loadBugs()
    }, [bugs])


    async function loadBugs() {
        if (loggedinUser?._id != null) {
            const bugs = await bugService.query({ userId: loggedinUser?._id })
            setBugs(bugs)
        }
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Successfully!')
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {

            const savedBug = await bugService.save(bugToSave)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    

    if(loggedinUser?._id === undefined) return <h2> User not logged in</h2>

    return (
        <section className='user-details'>
            <h2>Your Bug List</h2>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        </section>
    )
}
