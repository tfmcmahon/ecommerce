import React from 'react'
import {API} from '../../config/config'

const ProductImage = ({item, url}) => (
    <div className='productImageWrapper'>
        <img 
            src={`${API}/${url}/photo/${item._id}`} 
            alt={item.name}
            className='productImage'
        />
    </div>
)

export default ProductImage

/* style={{ maxHeight: '100%', maxWidth: '100%' }}
 */