/* eslint-env mocha */
/* eslint no-debugger: off */

const { expect } = require('chai')
const { Seneca } = require('./helpers')

const Mock = require('./mock/create')
const { setId } = require('./mock/project')

describe('Project Create Tests', () => {
  let seneca = null

  before(done => {
    Seneca()
      .then(instance => {
        seneca = instance
        return done(null)
      })
      .catch(done)
  })

  beforeEach(() => { debugger })

  it('Expect seneca instance not equal to null', done => {
    try {
      expect(seneca).not.to.equal(null)
      done(null)
    } catch (err) {
      done(err)
    }
  })

  it('Expect to not create an project because has invalid payload', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.invalid
      const expectMessageError = 'Invalid arguments'
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(false)
        expect(response.message).to.be.equal(expectMessageError)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to not create an project because project already exists', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.alreadyExists
      const expectMessageError = 'Project already exists'
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(false)
        expect(response.message).to.be.equal(expectMessageError)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to create an project', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.valid
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(true)
        expect(typeof response.result).to.be.equal('object')
        expect(typeof response.result._id).to.be.equal('string')
        expect(response.result.name).to.be.equal(payload.name)
        expect(response.result.email).to.be.equal(payload.email)
        setId(response.result._id)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })
})
