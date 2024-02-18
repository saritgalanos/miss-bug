
import { Link } from 'react-router-dom'
import { UserPreview } from './UserPreview'

export function UserList({ users, onRemoveUser, onEditUser }) {
    return (
        <ul className="user-list">
            <div className="headline">
                <UserPreview user={{ fullname: "Full Name", username: "User Name", score: "Score" }} />
            </div>
            {users.map((user) => (
                <li key={user._id} className="user-line">
                    <UserPreview user={user} />
                    <div>
                        <button onClick={() => {onRemoveUser(user._id) }} > x </button>
                        <button onClick={() => {onEditUser(user)}}> Edit </button>
                    </div>

                </li>
            ))}
        </ul>
    )
}
