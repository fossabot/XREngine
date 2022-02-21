import assert from 'assert'
import { v1 } from 'uuid'
import app from '../../../../server/src/app'

let invites: any = []
let user: any = null

describe('invite service', () => {
  before(async () => {
    await app.service('invite').hooks({
      before: {
        find: []
      }
    })

    // Create test user
    const type = 'password'
    const token = `${v1()}@xrengine.io`
    const password = 'test@123'

    user = await app.service('identity-provider').create(
      {
        type,
        token,
        password
      },
      {}
    )
  })

  after(async () => {
    // Remove test user
    await app.service('identity-provider').remove(null, {
      query: {
        userId: user.userId
      }
    })
  })

  it('registered the service', async () => {
    const service = await app.service('invite')
    assert.ok(service, 'Registered the service')
  })

  it('should create an invite with friend', async () => {
    const inviteType = 'friend'
    const token = `${v1()}@xrengine.io`
    const identityProviderType = 'email'

    const item = await app.service('invite').create({
      inviteType,
      token,
      targetObjectId: user.userId,
      inviteCode: null,
      identityProviderType,
      inviteeId: null
    })
    invites.push(item)

    assert.equal(item.inviteType, inviteType)
    assert.equal(item.token, token)
    assert.equal(item.targetObjectId, user.userId)
    assert.equal(item.identityProviderType, identityProviderType)
    assert.ok(item.id)
    assert.ok(item.passcode)
  })

  it('should create an invite with group', async () => {
    const inviteType = 'group'
    const token = `${v1()}@xrengine.io`
    const identityProviderType = 'email'

    const item = await app.service('invite').create({
      inviteType,
      token,
      targetObjectId: user.userId,
      inviteCode: null,
      identityProviderType,
      inviteeId: null
    })
    invites.push(item)

    assert.equal(item.inviteType, inviteType)
    assert.equal(item.token, token)
    assert.equal(item.targetObjectId, user.userId)
    assert.equal(item.identityProviderType, identityProviderType)
    assert.ok(item.id)
    assert.ok(item.passcode)
  })

  it('should create an invite with party', async () => {
    const inviteType = 'party'
    const token = `${v1()}@xrengine.io`
    const identityProviderType = 'email'

    const item = await app.service('invite').create({
      inviteType,
      token,
      targetObjectId: user.userId,
      inviteCode: null,
      identityProviderType,
      inviteeId: null
    })
    invites.push(item)

    assert.equal(item.inviteType, inviteType)
    assert.equal(item.token, token)
    assert.equal(item.targetObjectId, user.userId)
    assert.equal(item.identityProviderType, identityProviderType)
    assert.ok(item.id)
    assert.ok(item.passcode)
  })

  // it('should find received invites', async () => {
  //   const item = await app.service('invite').find({
  //     query: {
  //       type: 'received',
  //       userId: user.userId
  //     }
  //   })

  //   assert.ok(item, 'invite item is found')
  // })

  // it('should find sent invites', async () => {
  //   const item = await app.service('invite').find({
  //     query: {
  //       type: 'sent',
  //       userId: user.userId
  //     }
  //   })

  //   assert.ok(item, 'invite item is found')
  // })

  it('should remove invites', async () => {
    invites.forEach(async (invite) => {
      const item = await app.service('invite').remove(invite.id, {})
      assert.ok(item, 'invite item is removed')
    })
  })
})
