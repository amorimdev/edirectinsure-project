'use strict'

module.exports = {
  pattern: {
    role: 'project',
    cmd: 'create'
  },

  payload: {
    invalid: {
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    },

    alreadyExists: {
      name: 'Meu Primeiro Projeto',
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    },

    valid: {
      name: 'test',
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    }
  }
}
