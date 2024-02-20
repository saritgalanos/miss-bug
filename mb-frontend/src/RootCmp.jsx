
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { UserIndex } from './pages/UserIndex.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { UserContext } from './contexts/UserContext.js'
import { userService } from './services/user.service.js'
import { useState } from 'react'


export function App() {

  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
  return (
    <Router>
      <div>
      <UserContext.Provider value={{loggedinUser, setLoggedinUser}}>
        <AppHeader />
       
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/bug' element={<BugIndex />} />
            <Route path='/bug/:bugId' element={<BugDetails />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path='/user' element={<UserIndex />} />
            <Route path='/profile' element={<UserDetails />} />
          </Routes>
        </main>
        
        <AppFooter />
        </UserContext.Provider>
      </div>
    </Router>
  )
}
