'use strict'

const { pick } = require('lodash')

module.exports.defineSelectProjectPayload = params =>
  ({ ...pick(params, [ 'name' ]), credentials: { _id: params.user } })
