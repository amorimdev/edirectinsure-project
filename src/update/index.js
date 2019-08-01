'use strict'

const role = 'project'
const { project } = require('mongo-client/models')
const { pick, omit } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')
const {
  defineSelectProjectPattern
} = require('./patterns')
const {
  defineSelectProjectPayload
} = require('./payloads')

module.exports = function Update () {
  const seneca = this

  seneca.add({ role, cmd: 'update' }, cmdUpdate)

  async function cmdUpdate (args, done) {
    const params = pick(args, PICK_FIELDS)
    params.updatedAt = new Date()
    params.user = params.credentials._id
    delete params.credentials

    return selectProject(params)
      .then(params => updateProject(params))
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
        if (!params.name) {
          return resolve(params)
        }

        const pattern = defineSelectProjectPattern()
        const payload = defineSelectProjectPayload(params)
        return seneca.act(pattern, payload, (err, response) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err)
            return reject(err)
          }

          if (response.result &&
            response.result._id !== params._id) {
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

  function updateProject (params) {
    return new Promise((resolve, reject) => {
      project.findOneAndUpdate(pick(params, [ '_id' ]), {
        $set: omit(params, [ '_id' ])
      }, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (!entity) {
          return reject(new Error('Project not found'))
        }

        entity = { ...entity.toObject(), ...params }
        seneca.log.info(LOG_TAG, { entity })
        return resolve(entity)
      })
    })
  }

  return {
    name: role
  }
}
