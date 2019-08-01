'use strict'

module.exports = {
  pattern: {
    role: 'project',
    cmd: 'select'
  },

  payload: {
    all: {
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    },

    notFound: {
      _id: '5d41fea7f012517b1edf34e6',
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    },

    one: _id => ({
      _id,
      credentials: {
        _id: '5d41fea7f012517b1edf34e5'
      }
    })
  }
}
