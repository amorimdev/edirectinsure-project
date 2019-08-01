'use strict'

const role = 'project'
const { project, user } = require('mongo-client/models')
const { pick } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Delete () {
  const seneca = this

  seneca.add({ role, cmd: 'delete' }, cmdDelete)

  async function cmdDelete (args, done) {
    const params = pick(args, PICK_FIELDS)
    params.user = params.credentials._id
    delete params.credentials

    if (Object.keys(params).length !== 2) {
      return done(null, {
        status: false,
        message: 'Invalid arguments'
      })
    }

    return deleteProject(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function deleteProject (params) {
    return new Promise((resolve, reject) => {
      project.deleteOne(params, (err, result) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (!result.deletedCount) {
          return reject(new Error('Project not found'))
        }

        user.findOneAndUpdate(
          { _id: params.user },
          { $pull: { projects: { $in: [ params._id ] } } },
          err => {
            if (err) {
              seneca.log.fatal(LOG_TAG, err.message || err)
              return reject(err)
            }

            seneca.log.info(LOG_TAG, { result })
            return resolve(result.deletedCount)
          })
      })
    })
  }

  return {
    name: role
  }
}
