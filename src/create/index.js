'use strict'

const role = 'project'
const { project, user } = require('edirectinsure-mongo-client/models')
const { pick } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')
const {
  defineSelectProjectPattern
} = require('./patterns')
const {
  defineSelectProjectPayload
} = require('./payloads')

module.exports = function Create () {
  const seneca = this

  seneca.add({ role, cmd: 'create' }, cmdCreate)

  async function cmdCreate (args, done) {
    const params = pick(args, PICK_FIELDS)
    params.user = params.credentials._id
    delete params.credentials

    if (Object.keys(params).length !== 2) {
      return done(null, {
        status: false,
        message: 'Invalid arguments'
      })
    }

    return selectProject(params)
      .then(params => createProject(params))
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function selectProject (params) {
    return new Promise((resolve, reject) => {
      try {
        const pattern = defineSelectProjectPattern()
        const payload = defineSelectProjectPayload(params)
        return seneca.act(pattern, payload, (err, response) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err)
            return reject(err)
          }

          if (response.result) {
            return reject(new Error('Project already exists'))
          }

          return resolve(params)
        })
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err.message || err)
        return reject(err)
      }
    })
  }

  function createProject (params) {
    return new Promise((resolve, reject) => {
      project.create(params, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        user.findOneAndUpdate(
          { _id: params.user },
          { $push: { projects: entity } },
          err => {
            if (err) {
              seneca.log.fatal(LOG_TAG, err.message || err)
              return reject(err)
            }

            entity = {
              ...entity.toObject(),
              _id: entity._id.toString()
            }

            seneca.log.info(LOG_TAG, { entity })
            return resolve(entity)
          })
      })
    })
  }

  return {
    name: role
  }
}
