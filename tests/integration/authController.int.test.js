const request = require('supertest')
const app = require('../../server')
const newUser = require('../mockData/newUser.json')

const endPointUrl = '/api/register'

//db setup
const { setupDB } = require('../testSetup')
setupDB('ecommUsersTesting')

describe(endPointUrl, () => {
  it('POST ' + endPointUrl, async () => {
    const response = await request(app)
      .post(endPointUrl)
      .send(newUser)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newUser.name)
    expect(response.body.email).toBe(newUser.email)
  })
}) 



/* it('Should save user to database', async done => {
    const res = await request.post('/register')
        .send({
            name: 'Zoe',
            email: 'zoe@sesamestreet.com',
            password: 'abcdefg1'
        })
    // Searches the user in the database
    const user = await User.findOne({ email: 'zoe@sesamestreet.com' })
    expect(user.name).toBeTruthy()
    expect(user.email).toBeTruthy()
    done()
}) */