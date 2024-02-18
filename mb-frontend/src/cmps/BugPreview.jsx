

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <p>created By: {bug.creator.fullname}</p>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}