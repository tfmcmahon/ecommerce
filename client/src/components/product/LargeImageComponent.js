import React from 'react'

const LargeProductImage = ({ item, url }) => {

    if (item._id) {
        return (
            item &&
            <div className='productPageImageWrapper'>
                <img 
                    src={`/api/${url}/photo/${item._id}`} 
                    alt={item.name}
                    className='productPageImage'
                />
            </div>
        )
    } else {
        return null
    }
}

export default LargeProductImage