import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Layout from '../layout/LayoutComponent'
import { listOrders } from '../../actions/orderActions'
import { isAuthenticated, getUser } from '../../actions/authActions'


const Orders = () => {
    const [orders, setOrders] = useState([])

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

    return (
        <Layout
        title='Product Orders'
        description={`View and manage all orders`}
        >
            <div className='sectionWrapper'>
                {showOrdersLength()}
                {orders.map((order, index) => {
                    return (
                        <div className='orderWrapper' key={index}>
                            <p className='orderId'>Order ID: {order._id}</p>
                            <ul className='orderList'>
                                <li className='orderListItem'>
                                    <b>Order Status:</b> {order.status}
                                </li>
                                <li className='orderListItem'>
                                    <b>TansactionId:</b> {order.transactionId}
                                </li>
                                <li className='orderListItem'>
                                    <b>Ordered by:</b> {order.user.name}
                                </li>
                                <li className='orderListItem'>
                                    <b>Ordered on:</b> {moment(order.createdAt).fromNow()}
                                </li>
                                <li className='orderListItem'><b>Address Line 1:</b> {order.address.address1}</li>
                                {order.address.address2 
                                    ? <li className='orderListItem'><b>AddressLine 2:</b> {order.address.address2}</li>
                                    : null
                                }
                                <li className='orderListItem'><b>Address City:</b> {order.address.city}</li>
                                <li className='orderListItem'><b>Address State:</b> {order.address.state}</li>
                                <li className='orderListItem'><b>Address Zip Code:</b> {order.address.zip}</li>
                            </ul>
                            <div className='horizontalRule'></div>
                            <p className='orderLength'>Total products in order: {order.products.length}</p>
                        </div>
                    )
                })}
            </div>
        </Layout>
    )
}

export default Orders