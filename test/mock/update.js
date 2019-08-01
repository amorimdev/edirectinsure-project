'use strict'

module.exports = {
  pattern: {
    role: 'project',
    cmd: 'update'
  },

  payload: {
    notFound: {
      _id: '5d41fea7f012517b1edf34e6',
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    },

    alreadyExists: _id => ({
      _id,
      name: 'Meu Primeiro Projeto',
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    }),

    one: _id => ({
      _id,
      name: 'change',
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    })
  }
}
