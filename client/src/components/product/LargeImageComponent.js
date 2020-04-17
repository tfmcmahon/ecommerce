import React from 'react'
import { API } from '../../config/config'

const LargeProductImage = ({ item, url }) => {

    if (item._id) {
        return (
            item &&
            <div className='productPageImageWrapper'>
                <img 
                    src={`${API}/${url}/photo/${item._id}`} 
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