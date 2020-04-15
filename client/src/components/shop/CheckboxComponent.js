import React, { useState, useEffect } from 'react'


const Checkbox = ({ categories }) => {
    const [checked, setChecked] = useState([])

    const handleToggle = categoryId => ()=> {
        //check if category is already in the state
        const currentCategoryId = checked.indexOf(categoryId) // indexOf returns -1 if not found OR the first index if found
        const newCheckedCategoryId = [...checked]
        //if currently checked was not in the state, add it
        //if not, remove it
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(categoryId)
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1)
        }
        console.log(newCheckedCategoryId)
        setChecked(newCheckedCategoryId)
    }

    return (
        categories.map((category, index) => (
            <li className='checkboxListItem' key={index}>
                <input 
                    onChange={handleToggle(category._id)}
                    type='checkbox' 
                    className='checkboxInput' 
                    id={index} 
                    value={checked.indexOf(category._id === -1)}
                />
                <label htmlFor={index} className='checkboxLabel'>
                    {category.name}
                </label>
            </li>
        ))
    )
}

export default Checkbox