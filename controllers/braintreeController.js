require('dotenv').config()
const braintree = require('braintree')


//braintree connection set up
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

exports.generateToken = (req, res) => {
    //get a token, method per braintree docs
    gateway.clientToken.generate({}, function(err, token) {
        if (err) {
            res.status(500)
                .send(err)
        } else {
            res.send(token)
        }
    })
}

exports.processPayment = (req, res) => {
    let incomingNonce = req.body.paymentMethodNonce
    let paymentAmount = req.body.amount

    //process the payment (per braintree docs)
    gateway.transaction.sale(
        {
            amount: paymentAmount,
            paymentMethodNonce: incomingNonce,
            options: {
                submitForSettlement: true
            }
        }, 
        (err, result) => {
            if (err) {
                res.status(500)
                    .json(err)
            } else {
                res.json(result)
            }
        }
    )
}