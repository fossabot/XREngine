import assert from 'assert'
import app from '../../src/app'

describe('\'CollectionType\' service', () => {
  it('registered the service', () => {
    const service = app.service('collection-type')

    assert.ok(service, 'Registered the service')
  })
})
