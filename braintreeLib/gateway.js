const { connect, Environment } = require('braintree')
require('dotenv').config()

const gateway = connect({
  environment: Environment['Sandbox'],
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

module.exports = gateway