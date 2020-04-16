import React from 'react'

const Layout = ({ 
    title = 'Title', 
    description = 'Description',
    className,
    children 
}) => {
    return (
            <div className='layoutWrapper'>{children}</div>
    )
}

export default Layout