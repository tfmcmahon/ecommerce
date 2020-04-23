import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Layout from '../layout/LayoutComponent'
import { getUser, isAuthenticated } from '../../actions/authActions'
import { getOrderHistory } from '../../actions/userActions'

const Dashboard = () => {
    const [history, setHistory] = useState([])

    let { name, email, role, _id } = getUser()
    let token = isAuthenticated()

    useEffect(() => {
        getOrderHistory(_id, token)
            .then(data => {
                if (data.data.error) {
                    console.log(data.data.error)
                } else {
                    setHistory(data.data)
                }
            })
    }, [_id, token])

    const userLinks = () => {
        return (
            <div className='dashboardLinkWrapper'>
                <h3 className="dashboardCardTitle">Links</h3>
                <ul className='dashboardList'>
                    <li className='dashboardListLink'>
                        <Link to='/cart'>
                            <span className='dashboardCategory'>My Cart</span>
                        </Link>
                    </li>
                    <div className="horizontalRule"></div>
                    <li className='dashboardListLink'>
                        <Link to={`/profile/${_id}`}>
                            <span className='dashboardCategory'>Update Profile</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    const userInfo = () => {
        return (
            <div className='dashboardInfoWrapper'>
                <h3 className="dashboardCardTitle">Info</h3>
                <ul className='dashboardList'>
                    <li className='dashboardListItem'>
                        <span className='dashboardCategory'>Username</span>
                        <span className='dashboardInfo'>{name}</span>
                    </li>
                    <div className="horizontalRule"></div>
                    <li className='dashboardListItemDark'>
                        <span className='dashboardCategory'>Email</span>
                        <span className='dashboardInfo'>{email}</span>
                    </li>
                    <div className="horizontalRule"></div>
                    <li className='dashboardListItem'>
                        <span className='dashboardCategory'>Permissions</span>
                        <span className='dashboardInfo'>{role === 1 ? 'Admin' : 'Registered User'}</span>
                    </li>
                </ul>
            </div>
        )
    }

    const showInput = (key, value) => (
        <li className='productOrderWrapperInner'>
            <div className='productOrderKey'>{`${key}: `}</div>
            <div className='productOrderValue'>{value}</div>
        </li>
    )

    const userHistory = history => {
        return (
            <div className='dashboardHistoryWrapper'>
                <h3 className="dashboardCardTitle">Purchase History</h3>
                <ul className='dashboardList'>
                    { history.length > 0
                    ? history.map((hist, hIndex) =>{
                        return (
                            <li className='dashboardListItem'>
                                {hist.products.map((product, pIndex) => {
                                    return(
                                        <ul key={pIndex} className='orderListPH'>
                                            {showInput('Product name', product.name)}
                                            {showInput('Product price', `$${product.price}`)}
                                            {showInput('Purchase date', moment(product.createdAt).fromNow())}
                                        </ul>
                                    )
                                })}
                            </li>
                        )
                    })
                    : <li className='dashboardListItem'>
                        No purchase history yet
                    </li>
                    }
                </ul>
            </div>
        )
    }

    return (
        <Layout
        title='Dashboard'
        description={`Welcome, ${name}!`}
        >
            <div className="loginWrapper">
                <div className='dashboardRow'>
                </div>
            </div>
             <div className='dashboardWrapper'>
                {userInfo()}
                {userLinks()}
                {userHistory(history)}
            </div>

        </Layout>
    )
}

export default Dashboard