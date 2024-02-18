
import { useEffect, useState } from 'react'
import { UserMsg } from './UserMsg'
import { NavLink } from 'react-router-dom'
import { LoginSignup } from "./LoginSignup.jsx"
import { userService } from "../services/user.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function AppHeader() {
  useEffect(() => {
    // component did mount when dependancy array is empty
  }, [])

  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())


  async function onLogin(credentials) {
    console.log(credentials)
    try {
      const user = await userService.login(credentials)
      setLoggedinUser(user)
      showSuccessMsg(`Welcome ${user.fullname}`)
    } catch (err) {
      console.log('Cannot login :', err)
      showErrorMsg(`Cannot login`)
    }
  }

  async function onSignup(credentials) {
    console.log(credentials)
    try {
      const user = await userService.signup(credentials)
      setLoggedinUser(user)
      showSuccessMsg(`Welcome ${user.fullname}`)
    } catch (err) {
      console.log('Cannot signup :', err)
      showErrorMsg(`Cannot signup`)
    }
    // add signup
  }

  async function onLogout() {
    console.log('logout');
    try {
      await userService.logout()
      setLoggedinUser(null)
    } catch (err) {
      console.log('can not logout');
    }
    // add logout
  }

  function isAllowed() {
     return loggedinUser?.isAdmin
  }



  return (
    <header className='app-header '>
      <div className='header-container'>
        <nav className='app-nav'>
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
          {isAllowed() && <NavLink to="/user">Users</NavLink>} 
           <NavLink to="/about">About</NavLink> |
           <NavLink to="/profile">MyProfile</NavLink>
        </nav>
        <h1>Bugs are Forever</h1>

        <section className="login-signup-container">
          {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

          {loggedinUser && <div className="user-preview">
            <h3>Hello {loggedinUser.fullname}
              <button onClick={onLogout}>Logout</button>
            </h3>
          </div>}
        </section>

      </div>
      <UserMsg />
    </header>
  )
}
