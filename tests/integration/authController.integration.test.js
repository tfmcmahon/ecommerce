const testApp = require('../testApp')
const supertest = require('supertest')
const request = supertest(testApp)
const EcommerceUser = require('../../models/userModel')

//db setup
const { setupDB } = require('../testSetup')
setupDB('ecommUsersTesting', true)
      
const newUser = require('../mockData/newUser.json')

describe('Auth end points', () => {

  describe('POST /api/register', () => {

    //register
    it('should save user to database', async (done) => {
      //send new user data
      const res = await request.post('/api/register')
        .send(newUser)

      expect(res.status).toBe(201)
      //check that the user exists in the db
      const user = await EcommerceUser.findOne({ name: 'Zoe' })
      expect(user.name).toBeTruthy()
      expect(user.email).toBeTruthy()
      expect(res.body.user.name).toBeTruthy()
      expect(res.body.user.email).toBeTruthy()
      done()
    })

    //userRegisterValidator
    it('should reject mismatched passwords', async (done) => {
      //send new user data with mismatching passwords
      const res = await request.post('/api/register')
        .send({
          name: 'Zoe',
          email: 'zoe@sesamestreet.com',
          password: 'abcdefg1',
          password2: 'abcg1'
        })

      //check for 400 status and appropriate error message
      expect(res.status).toBe(400)
      expect(res.body.error).toStrictEqual('Passwords must match.')
      done()
    })

    it('should reject invalid emails', async (done) => {
      //send new user data with invalid email
      const res = await request.post('/api/register')
        .send({
          name: 'Zoe',
          email: 'zoeestreet.com',
          password: 'abcdefg1',
          password2: 'abcdefg1'
        })

      //check for 400 status and appropriate error message
      expect(res.status).toBe(400)
      expect(res.body.error).toStrictEqual('Email field must be a valid email adress.')
      done()
    })

  })

  describe('POST /api/login', () => {

    //login
    it('should allow a user to login', async (done) => {
      //send seeded user credentials
      const res = await request.post('/api/login')
        .send({
          email: 'count@sesamestreet.com',
          password: 'abcdefg1',
        })

      //check for 200 status, token, and matching user data
      expect(res.status).toBe(200)
      expect(res.body.token).toBeTruthy()
      expect(res.body.user.name).toStrictEqual('Count')
      expect(res.body.user.email).toStrictEqual('count@sesamestreet.com')
      done()
    })

    it('should reject incorrect passwords', async (done) => {
      //send incorrect user credentials
      const res = await request.post('/api/login')
        .send({
          email: 'count@sesamestreet.com',
          password: 'abcdefg1234',          //incorrect password
        })

      //check for 200 status and appropriate error message
      expect(res.status).toBe(401)
      expect(res.body.error).toStrictEqual('Email and password do not match.')
      done()
    })

  })

  describe('GET /api/login', () => {

    //logout
    it('should allow a user to logout', async (done) => {
      //send seeded user credentials
      const res = await request.get('/api/logout')

      //check for 200 status and message
      expect(res.status).toBe(200)
      expect(res.body.message).toStrictEqual('Signed out successfully.')
      done()
    })

  })

})