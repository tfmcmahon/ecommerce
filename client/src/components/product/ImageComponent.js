import React from 'react'

const ProductImage = ({ item, url }) => {

    if (item._id) {
        return (
            <div className='productImageWrapper'>
                <img 
                    src={`/api/${url}/photo/${item._id}`} 
                    alt={item.name}
                    className='productImage'
                />
            </div>
        )
    } else {
        return null
    }
}

export default ProductImage