import { useContext, useEffect, useState } from "react"
import { BugList } from "../cmps/BugList"
import { bugService } from "../services/bug.service"
import { showErrorMsg } from "../services/event-bus.service"
import { UserContext } from "../contexts/UserContext"
import { useParams } from "react-router"
import { msgService } from "../services/msg.service"

export function UserDetails() {
    const { loggedinUser, setLoggedinUser } = useContext(UserContext)
    const [bugs, setBugs] = useState([])
    const [msgs, setMsgs] = useState([])
    const { userId } = useParams()
    

    console.log('profile:', loggedinUser)
    useEffect(() => {
        loadBugsForUser()
        loadMsgsForUser()
    }, [loggedinUser])


    async function loadBugsForUser() {
        console.log('loading bugs for user:', loggedinUser._id)
        const userIdToQuery = (loggedinUser?._id) ? loggedinUser?._id : userId
       
        if (loggedinUser?._id != null) {
            const bugs = await bugService.query({ userId: userIdToQuery })
            setBugs(bugs)
            console.log(bugs)
        } 
    }

    async function loadMsgsForUser() {
        console.log('loading messages for user:', loggedinUser._id)
        const userIdToQuery = (loggedinUser?._id) ? loggedinUser?._id : userId
       console.log(userIdToQuery)
        try {
            const msgs = await msgService.query({ byUserId: userIdToQuery })
            setMsgs(msgs)
        } catch (err) {
            console.log('Had issues loading messages', err);
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



    if (loggedinUser?._id === undefined) return <h2> User not logged in</h2>
    console.log('rendering bugs:', bugs)
    return (
        <>
        <div>
            <h2>Your Details</h2>
            <pre>{JSON.stringify(loggedinUser, null, 2)}</pre>
        </div>
        <section className='user-details'>
            <h2>Your Bug List</h2>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        </section>
        <div>
            <h2>Your Messages</h2>
            <pre>{JSON.stringify(msgs, null, 2)}</pre>
        
        </div>
        </>
    )
}
