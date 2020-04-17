import React from 'react'
import Transition from '../../images/transition1.svg'

const Layout = ({ 
    title = 'Title', 
    description = 'Description',
    children 
}) => {
    return (
            <div className='layoutWrapper'>
                <h3 className="pageTitle">{title}</h3>
                <p className="pageDescription">{description}</p>
                <img src={Transition} className='landingImageFlip' alt='transition graphic'/>
                {children}
            </div>
    )
}

export default Layout