import React from 'react'
import { Link, withRouter } from 'react-router-dom'

//helper method which compares current page to history so that the active menu item can be highlighted
const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { background: '#412485', color: '#fff' } // styling for active menu item
    } else {
        return { background: '#303030', color: '#fff' } // styling for inactive menu items
    }
}

const Nav = ({ history }) => { //history is destructured from props
    return (
        <div>
            <header className="App-header">
                <div className="headerHelp">
                    <Link to="/" className="headerLink">
                        <div className="headerHelpType">
                            <p className="headerProjectTitle">Ecommerce</p>
                            <p className="headerProjectTitle">App</p>
                        </div>
                    </Link>
                    <div className="verticalRuleSmallWhite"></div>
                    <a 
                        className='headerGithub' 
                        href='https://github.com/tfmcmahon/ecommerce'
                        rel='noopener noreferrer' 
                        target='_blank'
                    >
                        <i className="fab fa-github-square fa-2x"></i>
                    </a>
                </div>

                <div className="headerHelp">
                    <div className="navButtonRow">
                        <Link to='/register'> 
                            <button
                                style={isActive(history, '/register')}
                                className="navButton"
                            >
                                Register
                            </button>
                        </Link>
                        <Link to='/login'> 
                            <button
                                style={isActive(history, '/login')}
                                className="navButton"
                            >
                                Login
                            </button>
                        </Link>
                    </div>
                    <div className="verticalRuleSmallWhite"></div>
                    <Link to='/'> 
                        <button
                            style={isActive(history, '/')}
                            className="homeButton"
                        >
                            Home
                        </button>
                    </Link>
                </div>


            </header> 
        </div>
    )
}

export default withRouter(Nav)