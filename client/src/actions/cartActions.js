export const addItemToCart = (item, next) => {
    let cart = []                                                   //make a storage variable for the cart
    if (typeof window !== 'undefined') {                            //check that we are in a web browser so that we can access local storage
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))         //write to the cart variable from local storage, parsed to an object
        }
        cart.push({
            ...item,
            count: 1
        })
        //prevent duplicate items from being added to the cart (increment count instead)
        cart = Array.from(                                          //create a new array ...
            new Set(                                                //with no duplicates ...
                cart.map((product) => product._id)                  //consisting of the product Ids ...
            )
        ).map(id => {
            return cart.find(product => product._id === id)         //return the first product that matches the id
        })
        //rewrite the cart variable with the new, no-duplicates array
        localStorage.setItem('cart', JSON.stringify(cart))
        next()
    }
}

export const cartItemTotal = () => {
    if (typeof window !== 'undefined') {                            //check that we are in a web browser so that we can access local storage
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart')).length //grab the cart size
        }
    }
    return 0
}

export const getCart = () => {
    if (typeof window !== 'undefined') {                            //check that we are in a web browser so that we can access local storage
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'))
        }
    }
    return []
}

export const updateCartItem = (productId, count) => {
    let cart = []                                                   //make a storage variable for the cart
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))         //write to the cart variable from local storage, parsed to an object
        }
        cart.forEach((product, index) => {
            if (product._id === productId) {                         //match to passed product
                cart[index].count = count
            }
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}

export const removeCartItem = (productId) => {
    let cart = []                                                   //make a storage variable for the cart
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'))         //write to the cart variable from local storage, parsed to an object
        }
        cart.forEach((product, index) => {
            if (product._id === productId) {                        //match to passed product
                cart.splice(index, 1)
            }
        })
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    return cart
}