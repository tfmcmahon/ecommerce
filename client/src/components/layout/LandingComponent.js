import React from 'react'
import Layout from './LayoutComponent'
import { API } from '../../config/config'

const test = process.env.REACT_APP_API_URL || 'not working'

const Landing = () => {
    return (
        <Layout 
        title='Home Page'
        description='MERN E-commerce App'
        >
            {API}
        </Layout>
    )
}

export default Landing