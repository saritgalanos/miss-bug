import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { useCallback, useContext, useState } from 'react'
import { useEffect } from 'react'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'
import { UserList } from '../cmps/UserList.jsx'
import { UserFilter } from '../cmps/UserFilter.jsx'
import { bugService } from '../services/bug.service.js'
import { UserContext } from '../contexts/UserContext.js'


export function UserIndex() {
  const [users, setUsers] = useState([])
  const [filterBy, setFilterBy] = useState(userService.getDefaultFilter())
  const debounceSetFilterBy = useCallback(utilService.debounce(onSetFilterBy, 500), [])
  const {loggedinUser, setLoggedinUser} = useContext(UserContext)


  useEffect(() => {
    loadUsers()
  }, [filterBy])

  async function loadUsers() {
    if (!isAllowed()) return
    const users = await userService.getUsers(filterBy)
    setUsers(users)
  }

  async function onRemoveUser(userId) {
    try {
      const bugs = await bugService.query({ userId })
      console.log(bugs)
      if (bugs.length != 0) {
        console.log('cannot remove user that has open bugs')
        showErrorMsg('Cannot remove user')
        return
      }
      await userService.remove(userId)
      console.log('Deleted Successfully!')
      setUsers(prevUsers => prevUsers.filter((user) => user._id !== userId))
      showSuccessMsg('User removed')
    } catch (err) {
      console.log('Error from onRemoveUser ->', err)
      showErrorMsg('Cannot remove user')
    }
  }

  async function onAddUser() {
    const user = {
      fullname: prompt('fullname?'),
      username: prompt('username?'),
      password: prompt('password?'),
      score: +prompt('score?')

    }
    try {
      const savedUser = await userService.save(user)
      setUsers(prevUsers => [...prevUsers, savedUser])
      showSuccessMsg('User added')
    } catch (err) {
      console.log('Error from onAddUser ->', err)
      showErrorMsg('Cannot add user')
    }
  }

  async function onEditUser(user) {
    const password = prompt('New password?')
    const userToSave = { ...user, password }
    try {

      const savedUser = await userService.save(userToSave)
      setUsers(prevUsers => prevUsers.map((currUser) =>
        currUser._id === savedUser._id ? savedUser : currUser
      ))
      showSuccessMsg('User updated')
    } catch (err) {
      console.log('Error from onEditUser ->', err)
      showErrorMsg('Cannot update User')
    }
  }

  function isAllowed() {
    return loggedinUser?.isAdmin
  }

  function onSetFilterBy(filterBy) {
    console.log('onSetFilterBy: user:',filterBy)
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onChangePageIdx(pageIdx) {
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  }
  if (!isAllowed()) return <div> Only Admin can view this page</div>

  const isPaging = filterBy.pageIdx !== undefined

  return (
    <main className="main-layout">
      <h2>Users</h2>
      <main>
        <div className="user-pagination">
          <label> Use paging
            <input type="checkbox" checked={isPaging} onChange={() => onChangePageIdx(isPaging ? undefined : 0)} />
          </label>
          {isPaging && <>
            <button onClick={() => onChangePageIdx(filterBy.pageIdx - 1)}>-</button>
            <span>{filterBy.pageIdx + 1}</span>
            <button onClick={() => onChangePageIdx(filterBy.pageIdx + 1)}>+</button>
          </>}
        </div>

        <UserFilter filterBy={filterBy} onSetFilterBy={debounceSetFilterBy} />
        <button onClick={onAddUser}>Add User </button>
        <UserList users={users} onRemoveUser={onRemoveUser} onEditUser={onEditUser} />
      </main>
    </main>
  )
}
