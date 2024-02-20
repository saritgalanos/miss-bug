import { useEffect, useState } from "react"

export function UserFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }
        console.log(field)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }


    const { fullname } = filterByToEdit
    return (
        <section className="user-filter">
            <h2>Filter Our Users</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="fullname">Full Name: </label>
                <input value={fullname} onChange={handleChange} type="text" placeholder="By Full Name" id="fullname" name="fullname" />

                <button onClick={onSubmitFilter}>Set Filter</button>
            </form>
        </section>
    )
}