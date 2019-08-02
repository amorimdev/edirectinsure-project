'use strict'

const role = 'project'
const { project } = require('edirectinsure-mongo-client/models')
const { pick } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Select () {
  const seneca = this

  seneca.add({ role, cmd: 'select' }, cmdSelect)

  async function cmdSelect (args, done) {
    const params = pick(args, PICK_FIELDS)
    params.user = params.credentials._id
    delete params.credentials

    return selectProject(params)
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
      const method = (params._id || params.name) &&
        'findOne' || 'find'
      project[method](params, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (Array.isArray(entity)) {
          const entities = entity.map(item => ({
            ...item.toObject(),
            _id: item._id.toString()
          }))

          seneca.log.info(LOG_TAG, { entities })
          return resolve(entities)
        }

        if (!entity) {
          return reject(new Error('Project not found'))
        }

        entity = {
          ...entity.toObject(),
          _id: entity._id.toString()
        }

        seneca.log.info(LOG_TAG, { entity })
        return resolve(entity)
      })
    })
  }

  return {
    name: role
  }
}
