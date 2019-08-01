/* eslint-env mocha */
/* eslint no-debugger: off */

const { expect } = require('chai')
const { Seneca } = require('./helpers')

const Mock = require('./mock/update')
const { getId } = require('./mock/project')

describe('Project Update Tests', () => {
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

  it('Expect to not update an project because project not found', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.notFound
      const expectMessageError = 'Project not found'
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

  it('Expect to not update an project because email already exists', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.alreadyExists(getId())
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

  it('Expect to update an project', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.one(getId())
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
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })
})
