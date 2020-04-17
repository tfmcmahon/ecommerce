import React, { useState, useEffect } from 'react'
import { getCart } from '../../actions/cartActions'
import ProductCard from '../product/ProductCardComponent'
import Checkout from './CheckoutComponent'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'

const Cart = () => {
    const [items, setItems] = useState([])
    const [run, setRun] = useState(false)

    useEffect(() => {
        setItems(getCart())
    }, [run])

    const showItems = items => (
        <div>
            <p className='itemLength'>Your cart has {items.length} {items.length === 1 ? 'item' : 'items'} in it</p>
            <div className='horizontalRule'></div>
            <div className='whiteCardWrapper'>
                {items.map((product, index) => (
                    <ProductCard 
                        key={index} 
                        product={product} 
                        showAddToCartButton={false}
                        cartUpdate={true}
                        cartRemove={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        </div>
    )

    const noItemsMessage = () => (
        <div className='cartEmptyWrapper'>
            <p className='itemLength'>Your cart is empty</p>
            <div className='horizontalRule'></div>
            <div className='whiteCardWrapper'>
                <Link to='/shop'>
                    <button className='navButton'>
                        Shop
                    </button>
                </Link>
            </div>
        </div>
    )

    return (
        <Layout
            title='Shopping Cart'
            description='Add, remove, checkout, or continue shopping'
        >
            <div className='cartWrapper'>
                <div className='cartLeft'>
                    <div className='cartMessageWrapper'>
                        {items.length > 0 
                            ? showItems(items)
                            : noItemsMessage()
                        }
                    </div>
                </div>
                <div className='verticalRule'></div>
                <div className='cartRight'>
                <div className='cartEmptyWrapper'>
                    <p className='itemLength'>Cart summary</p>
                    <div className='horizontalRule'></div>
                    <div className='whiteCardWrapper'>
                        <Checkout products={items} />
                    </div>
                </div>
                </div>
            </div>
            {items.length < 1 
            ? <div className='whiteFillHelpCartLarge'></div>
            : <div className='whiteFillHelpCart'></div>
            }
        </Layout>
    )
}

export default Cart