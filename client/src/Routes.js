import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

//component import
import Register from './components/user/RegisterComponent'
import Login from './components/user/LoginComponent'
import Landing from './components/layout/LandingComponent'
import Nav from './components/layout/NavComponent'
import Footer from './components/layout/FooterComponent'

const Routes = () => {
    return (
        <Router>
            <div className="wrapper">
                <Nav />
                <Switch>
                    <Route exact path='/' component={Landing} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/register' component={Register} />
                </Switch>
                <div className="whiteFill"></div>
            </div>
            <Footer />
        </Router>
    )
}

export default Routes