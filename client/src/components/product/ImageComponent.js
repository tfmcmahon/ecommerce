import React from 'react'
import { API } from '../../config/config'

const ProductImage = ({ item, url }) => {

    if (item._id) {
        return (
            <div className='productImageWrapper'>
                <img 
                    src={`${API}/${url}/photo/${item._id}`} 
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