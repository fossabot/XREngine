import assert from 'assert'
import app from '../../src/app'

describe('\'UserRelationship\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-relationship')

    assert.ok(service, 'Registered the service')
  })
})
