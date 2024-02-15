

export function UserPreview({ user }) {

    return <article className="user-preview" >
        <div> {`${user.fullname} `}</div>
        <div> {`${user.username} `}</div>
        <div> {`${user.score} `}</div>
        <div> {`${user.password} `}</div>
        
    </article>
}