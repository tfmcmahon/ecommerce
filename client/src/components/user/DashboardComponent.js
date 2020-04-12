import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import Transition from '../../images/transition1.svg'
import { getUser } from '../../actions/authActions'

const Dashboard = () => {

    let { _id, name, email, role } = getUser()

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
                        <Link to='/profile/update'>
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

    const userHistory = () => {
        return (
            <div className='dashboardHistoryWrapper'>
                <h3 className="dashboardCardTitle">Purchase History</h3>
                <ul className='dashboardList'>
                    <li className='dashboardListItem'>
                        <span className='dashboardCategory'>History</span>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <Layout
        title='Dashboard'
        description='User Dashboard'
        >
            <div className="loginWrapper">
                <div className='dashboardRow'>
                    <h3 className='dashboardHeader'>Dashboard</h3>
                    <p className='dashboardSubheader'>{`Welcome, ${name}!`}</p>
                </div>
            </div>
            <img src={Transition} alt="transition graphic" className="landingImage"></img>
            <div className='dashboardWrapper'>
                {userInfo()}
                {userLinks()}
                {userHistory()}
            </div>

        </Layout>
    )
}

export default Dashboard