import React from 'react'

const Layout = ({ 
    title = 'Title', 
    description = 'Description',
    className,
    children 
}) => {
    return (
        <div>
            <div className=''>
            </div>
            <div className={className}>{children}</div>
        </div>
    )
}

export default Layout