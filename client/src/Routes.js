import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

//component import
import Register from './components/user/RegisterComponent'
import Login from './components/user/LoginComponent'
import Landing from './components/layout/LandingComponent'
import Nav from './components/layout/NavComponent'
import Footer from './components/layout/FooterComponent'
import Dashboard from './components/user/DashboardComponent'
import Shop from './components/shop/ShopComponent'
import AdminDashboard from './components/admin/AdminDashboardComponent'
import AddCategory from './components/admin/AddCategoryComponent'
import AddProduct from './components/admin/AddProductComponent'
import ProductPage from './components/product/ProductPageComponent'
import Cart from './components/cart/CartComponent'
import PrivateRoute from './components/auth/PrivateRoute'
import AdminRoute from './components/auth/AdminRoute'

const Routes = () => {
    return (
        <Router>
            <div className="wrapper">
                <Nav />
                <Switch>
                    <Route exact path='/' component={Landing} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/shop' component={Shop} />
                    <Route exact path='/cart/' component={Cart} />
                    <Route exact path='/product/:productId' component={ProductPage} />
                    <PrivateRoute exact path='/user/dashboard' component={Dashboard} />
                    <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
                    <AdminRoute exact path='/create/category' component={AddCategory} />
                    <AdminRoute exact path='/create/product' component={AddProduct} />
                </Switch>
                <div className="whiteFill"></div>
            </div>
            <Footer />
        </Router>
    )
}

export default Routes