import React from 'react'
import { Link } from 'react-router-dom'
import Layout from './LayoutComponent'
import ReactFreezeframe from 'react-freezeframe'
import checkout from '../../images/Checkout.gif'
import dashboard from '../../images/Dashboard.gif'
import filters from '../../images/Filters.gif'
import posterPage from '../../images/PosterPage.gif'
import search from '../../images/Search.gif'


const Landing = () => {

    return (
        <Layout 
        title='Welcome to the Poster Shop App'
        description='A full stack web application built with Node, Express, Mongoose, and React. Tested with Jest.'
        >
            <div className="walkThroughIntro">  
                <p>
                    Check out the app features below. Hover over the images to see them in action, or use the buttons to get started:
                </p>
                <div className="landingButtonRow">
                    <Link to='/register'> 
                        <button
                            className="navButton"
                        >
                            Register
                        </button>
                    </Link>
                    <div className='verticalRuleSmall'></div>
                    <Link to='/shop'> 
                        <button
                            className="shopButtonLanding"
                        >
                            Shop
                        </button>
                    </Link>
                </div>
            </div>
            <div className="walkthroughWrapper">
                <div className="walkthroughItem">
                    <h3 className="walkThroughName">Search bar</h3>
                    <div className="gif">
                        <ReactFreezeframe src={search} />
                    </div>
                    <p className="walkThroughText">
                        Use the search bar to search the poster shop.
                        The category drop down can be used to narrow down posters by genre.
                    </p>
                </div>

                <div className="walkthroughItem">
                    <h3 className="walkThroughName">Shop filters</h3>
                    <div className="gif">
                        <ReactFreezeframe src={filters} />
                    </div>
                    <p className="walkThroughText">
                        The app allows the user to filter the shop by category or price.
                        The categories are populated dynamically based on the existing categories in the back-end.
                    </p>
                </div>

                <div className="walkthroughItem">
                    <h3 className="walkThroughName">Poster page</h3>
                    <div className="gif">
                        <ReactFreezeframe src={posterPage} />
                    </div>
                    <p className="walkThroughText">
                        The app will produce a poster info page which contains larger artwork.
                        The front-end sends paramaters to the back-end where all of the images are stored.
                    </p>
                </div>

                <div className="walkthroughItem">
                    <h3 className="walkThroughName">Checkout</h3>
                    <div className="gif">
                        <ReactFreezeframe src={checkout} />
                    </div>
                    <p className="walkThroughText">
                        The app is integrated with Braintree as a payment service.
                        Payments can be processed only after an address is entered.
                        Try making up credentials to test it (card number must start with "4111").
                    </p>
                </div>

                <div className="walkthroughItem">
                    <h3 className="walkThroughName">Dashboard</h3>
                    <div className="gif">
                        <ReactFreezeframe src={dashboard} />
                    </div>
                    <p className="walkThroughText">
                        Users can access their complete purchase history from the dashboard.
                        They can also update their profile by following the appropriate link.
                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Landing