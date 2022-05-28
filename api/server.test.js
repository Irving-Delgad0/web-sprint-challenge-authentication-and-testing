const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const user1 = {username: 'alice', password: '12345'}
const user2 = {username: 'Jack', password: '456123'}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})



// Write your tests here
describe('auth endpoints', () => {
  describe('POST api/auth/register', () => {
    test('adds new user on success', async () => {
      await request(server).post('/api/auth/register').send(user1)
      const user = await db('users').first()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password')
      expect(user.username).toBe(user1.username)
    })
    test('new user has encrypted password', async () => {
      await request(server).post('/api/auth/register').send(user1)
      const user = await db('users').first()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('username')
      expect(user).toHaveProperty('password')
      expect(user.password).not.toBe(user1.password)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(server).post('/api/auth/register').send(user1)
    })

    test('Token present on successful login', async () => {
      const res = await request(server).post('/api/auth/login').send(user1)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("token")
      expect(res.body.message).toBe(`welcome, ${user1.username}`)
      expect(res.body.token).toBeDefined()
    })

    test('receive correct message on invalid login', async () => {
      const res = await request(server).post('/api/auth/login').send(user2)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('invalid credentials')
    })
  })

  describe('GET /api/jokes', () => {
    beforeEach(async () => {
      await request(server).post('/api/auth/register').send(user1)
    })

    test('returns data on successful call', async () => {
      const res = await request(server).post('/api/auth/login').send(user1)
      expect(res.status).toBe(200)
    })

    test('returns correct error message if not logged in', async () => {
      let res = await request(server).get('/api/jokes')
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toBe('token required')
    })
  })
})
















test('sanity', () => {
  expect(true).not.toBe(false)
})


