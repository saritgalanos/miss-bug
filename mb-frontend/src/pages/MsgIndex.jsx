import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import { userService } from '../services/user.service'
import { msgService } from '../services/msg.service'
import { bugService } from '../services/bug.service'

export function MsgIndex() {

    const [bugs, setBugs] = useState(null)
    const [msgs, setMsgs] = useState(null)
    const loggedInUser = userService.getLoggedinUser()

    const [msgToEdit, setMsgToEdit] = useState({ txt: '', aboutBugsId: '' })


    useEffect(() => {
        loadMsgs()
        loadBugs()
    }, [])

    async function loadBugs() {
        try {
            const bugs = await bugService.query()
            setBugs(bugs)
        } catch (err) {
            console.log('Had issues loading bugs', err);
        }
    }

    async function loadMsgs() {
        try {
            const msgs = await msgService.query()
            setMsgs(msgs)
        } catch (err) {
            console.log('Had issues loading messages', err);
        }
    }

    const handleChange = ev => {
        const { name, value } = ev.target
        setMsgToEdit({ ...msgToEdit, [name]: value })
    }

    const onAddMsg = async ev => {
        ev.preventDefault()
        if (!msgToEdit.txt || !msgToEdit.aboutBugId) return alert('All fields are required')
        try {

            const msg = await msgService.add(msgToEdit)
            showSuccessMsg('Msg added')
            setMsgToEdit({ txt: '', aboutBugId: '' })
            setMsgs(prevMsgs => [...prevMsgs, msg])
        } catch (err) {
            showErrorMsg('Cannot add msg')
        }
    }

    const onRemove = async msgId => {
        try {
            await msgService.remove(msgId)
            showSuccessMsg('Message removed')
            setMsgs(prevMsgs => prevMsgs.filter(r => r._id !== msgId))
        } catch (err) {
            showErrorMsg('Cannot remove')
        }
    }

    function canRemove(msg) {
        return true
        // if (!loggedInUser) return false
        // return msg?.byUser?._id === loggedInUser?._id || loggedInUser.isAdmin
    }

    return (
        <div className="msg-index">
            <h1>Msgs about Bugs</h1>
            {msgs && <ul className="msg-list">
                {msgs.map(msg => (
                    <li key={msg._id}>
                        {canRemove(msg) &&
                            <button onClick={() => onRemove(msg._id)}>X</button>}
                        {msg.aboutBug && <p>
                            About Bug:
                            <Link to={`/bug/${msg.aboutBug._id}`}>
                                {msg.aboutBug.title}
                            </Link>
                        </p>}
                        <h3>{msg.txt}</h3>
                        {msg.byUser && <p>
                            By:
                            <Link to={`/profile/${msg.byUser._id}`}>
                                {msg.byUser.fullname}
                            </Link>
                        </p>}
                    </li>
                ))}
            </ul>}
            {bugs && loggedInUser &&
                <form onSubmit={onAddMsg}>
                    <select
                        onChange={handleChange}
                        value={msgToEdit.aboutBugId}
                        name="aboutBugId"
                    >
                        <option value="">Select Bug</option>
                        {bugs.map(bug => (
                            <option key={bug._id} value={bug._id}>
                                {bug.title}
                            </option>
                        ))}
                    </select>
                    <textarea
                        name="txt"
                        onChange={handleChange}
                        value={msgToEdit.txt}
                    ></textarea>
                    <button>Add</button>
                </form>}
            <hr />
        </div>
    )
}