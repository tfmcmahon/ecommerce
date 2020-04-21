import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Layout from '../layout/LayoutComponent'
import { listOrders, getOrderStatus, updateOrderStatus } from '../../actions/orderActions'
import { isAuthenticated, getUser } from '../../actions/authActions'


const Orders = () => {
    const [orders, setOrders] = useState([])
    const [status, setStatus] = useState([])

    const userId = getUser() && getUser()._id
    const token = isAuthenticated()

    useEffect(() => {
        listOrders(userId, token)
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setOrders(data.data)
                }
            })
        getOrderStatus(userId, token)
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setStatus(data.data)
                }
            })
    }, [])

    const showOrdersLength = () => {
        if (orders.length > 0 ) {
            return (
                <h3 className='productCategoryHeader'>Total orders: {orders.length}</h3>
            )
        } else {
            return (
                <h3 className='productCategoryHeader'>No orders</h3> 
            )
        }
    }

    const showInput = (key, value) => (
        <li className='productOrderWrapperInner'>
            <div className='productOrderKey'>{`${key}: `}</div>
            <div className='productOrderValue'>{value}</div>
        </li>
    )

    const handleChange = (event, orderId) => {
        updateOrderStatus(orderId, userId, event.target.value, token) // event.target.value = status
            .then(item => {
                if (item.data.error) {
                    console.log('Status update failed')
                } else {
                    listOrders(userId, token)
                        .then(data => {
                            if (data.data.error) {
                                console.log(data.data.error)
                            } else {
                                setOrders(data.data)
                            }
                        })
                }
            })
    }

    const showStatus = order => (
        <div className='searchInputWrapper'>
            <div className='searchSelectWrapperAdmin'>
                <h3 className='productCategoryHeaderAdmin'>Status: {order.status}</h3>
                <select 
                    className='searchSelectAdmin' 
                    onChange={(event) => handleChange(event, order._id)} 
                    name='category'
                >
                    <option className='searchDropdown'>Update Status</option>
                    {status.map((stat, index) => (
                        <option key={index} value={stat} className='searchDropdown'>
                            {stat}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )

    return (
        <Layout
            title='Product Orders'
            description={`View and manage all orders`}
        >
            <div className='sectionWrapper'>
                {showOrdersLength()}
                {orders.map((order, oIndex) => {
                    return (
                        <div className='productOrderWrapper' key={oIndex}>
                            <p className='orderId'>Order ID: {order._id}</p>
                            <ul className='orderList'>
                                {showStatus(order)}
                                {showInput('TransactionId', order.transactionId)}
                                {showInput('Ordered by', order.user.name)}
                                {showInput('Ordered on', moment(order.createdAt).fromNow())}
                                {showInput('Address Line 1', order.address.address1)}
                                {showInput('AddressLine 2', order.address.address2)}
                                {showInput('Address City', order.address.city)}
                                {showInput('Address State', order.address.state)}
                                {showInput('Address Zip Code', order.address.zip)}
                            </ul>
                            <div className='horizontalRule'></div>
                            <p className='orderLength'>Total products in order: {order.products.length}</p>
                            {order.products.map((product, pIndex) => (
                                <div className='orderWrapper' key={pIndex}>
                                    <ul className='orderList'>
                                        {showInput('Product name', product.name)}
                                        {showInput('Product price', `$${product.price}`)}
                                        {showInput('Product count', product.count)}
                                        {showInput('Product Id', product._id)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}

export default Orders