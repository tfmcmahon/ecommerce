import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../layout/LayoutComponent'
import Transition from '../../images/transition1.svg'
import { getUser } from '../../actions/authActions'

const AdminDashboard = () => {

    let { name, email, role } = getUser()

    const adminLinks = () => {
        return (
            <div className='dashboardLinkWrapper'>
                <h3 className="dashboardCardTitle">Admin Links</h3>
                <ul className='dashboardList'>
                    <li className='dashboardListLink'>
                        <Link to='/create/category'>
                            <span className='dashboardCategory'>Create Category</span>
                        </Link>
                    </li>
                    <div className="horizontalRule"></div>
                    <li className='dashboardListLink'>
                        <Link to='/create/product'>
                            <span className='dashboardCategory'>Create Product</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    const adminInfo = () => {
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
            <div className='dashboardWrapperAdmin'>
                {adminInfo()}
                {adminLinks()}
            </div>

        </Layout>
    )
}

export default AdminDashboard