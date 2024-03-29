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
  ...((process.env.PROJECT_TRANSPORT === 'amqp' && {
    type: process.env.PROJECT_TRANSPORT,
    url: process.env.AMQP_URL
  }) || {
    type: process.env.PROJECT_TRANSPORT || 'http',
    host: process.env.PROJECT_HOST || '0.0.0.0',
    port: process.env.PROJECT_PORT || process.env.PORT || 8203,
    protocol: process.env.PROJECT_PROTOCOL || 'http'
  }),
  pin: { role: 'project', cmd: '*' }
})

seneca.ready(() => {
  const { mongoClient } = require('edirectinsure-mongo-client')
  return mongoClient(seneca).catch(() => seneca.close())
})

module.exports = seneca
