require('dotenv').config()
//const braintree = require('braintree')
const gateway = require('../braintreeLib/gateway') //braintree connection set up

exports.generateToken = async (req, res) => {
    //get a token, method per braintree docs
    try {
        const token = await gateway.clientToken.generate({})
        res.status(200).send(token)
    } catch (err) {
        res.status(500).send(err)
    }
}

exports.processPayment = async (req, res) => {
    let incomingNonce = req.body.paymentMethodNonce
    let paymentAmount = req.body.amount
    try {
        //process the payment (per braintree docs)
        const result = await gateway.transaction.sale({
            amount: paymentAmount,
            paymentMethodNonce: incomingNonce,
            options: { submitForSettlement: true }
        })
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json(err)
    }
}