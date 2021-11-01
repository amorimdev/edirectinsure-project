'use strict'

const Create = require('../src/create')
const Select = require('../src/select')
const Update = require('../src/update')
const Delete = require('../src/delete')

const seneca = require('seneca')()

seneca.use(Create)
seneca.use(Select)
seneca.use(Update)
seneca.use(Delete)

seneca.listen({
  type: process.env.PROJECT_PROTOCOL || 'http',
  host: process.env.PROJECT_HOST || '0.0.0.0',
  port: process.env.PROJECT_PORT || process.env.PORT || 8203,
  pin: { role: 'project', cmd: '*' }
})

seneca.ready(() => {
  const { mongoClient } = require('edirectinsure-mongo-client')
  return mongoClient(seneca).catch(() => seneca.close())
})

module.exports = seneca
