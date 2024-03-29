
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const {loggedinUser, setLoggedinUser} = useContext(UserContext)


  function isAllowed(bug) {
    return bug.creator._id === loggedinUser?._id || loggedinUser?.isAdmin
  }


  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            {isAllowed(bug) && <button onClick={() => { onRemoveBug(bug._id) }} > x </button>}
            <button onClick={() => { onEditBug(bug) }}> Edit</button>
            {isAllowed(bug) && <button> <Link to={`/bug/${bug._id}`}>Details</Link></button>}
          </div>
        </li>
      ))}
    </ul>
  )
}
