import { useEffect, useState } from "react"

export function BugFilter({ filterBy, onSetFilterBy }) {

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

    function setSortSelection(option) {
        console.log(`Option selected: ${option}`); // Do something with the selected option
        filterByToEdit.sortBy = option
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [sortBy]: option }))
        onSetFilterBy(filterByToEdit)
    }


    const { txt, description, minSeverity, sortBy } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <div className="filter-display">
                <form onSubmit={onSubmitFilter}>
                    <label htmlFor="txt">Title: </label>
                    <input value={txt} onChange={handleChange} type="text" placeholder="By Title" id="txt" name="txt" />

                    <label htmlFor="description">Description: </label>
                    <input value={description} onChange={handleChange} type="text" placeholder="By Description" id="description" name="description" />


                    <label htmlFor="minSeverity">Min Severity: </label>
                    <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                    {/* <button onClick={onSubmitFilter}>Set Filter</button> */}

                </form>
                <SortDropdown setSortSelection={setSortSelection} />
                <p> {sortBy} </p>
            </div>
        </section>
    )
}



function SortDropdown({ setSortSelection }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => setIsOpen(!isOpen);

    function handleSelect(option) {
        setIsOpen(false); // Close the dropdown after selection
        setSortSelection(option)
    }

    return (
        <div className="sort-dropdown">
            <button onClick={toggleDropdown}>Sort By: </button>
            {isOpen && (
                <ul>
                    <li onClick={() => handleSelect('title')}>Title</li>
                    <li onClick={() => handleSelect('severity')}>Severity</li>
                    <li onClick={() => handleSelect('createdAt')}>Creation Date</li>
                </ul>
            )}
        </div>
    )
}