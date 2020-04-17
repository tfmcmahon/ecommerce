import React, { useState } from 'react'


const PriceFilter = ({ prices, handleFilters }) => {
    const [value, setValue] = useState(0)

    const handleChange = (event) => {
        handleFilters(event.target.value)
        setValue(event.target.value)
    }

    return (
        prices.map((price, index) => (
            <li className='checkboxListItem' key={index}>
                <input 
                    onChange={handleChange}
                    type='radio' 
                    id={index} 
                    value={`${price._id}`}
                    name={price}
                />
                <label htmlFor={index} className='radioLabel'>
                    {price.name}
                </label>
            </li>
        ))
    )
}

export default PriceFilter