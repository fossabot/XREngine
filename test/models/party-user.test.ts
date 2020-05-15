// import app from '../../src/app'

// describe('CRUD operation on \'PartyUser\' model', () => {
//   const model = app.service('party-user').Model
//   const partyModel = app.service('party').Model
//   const userModel = app.service('user').Model
//   let partyId, userId

//   before(async () => {
//     const party = await partyModel.create({})
//     partyId = party.id
//     const user = await userModel.create({})
//     userId = user.id
//   })

//   it('Create', done => {
//     model.create({
//       isOwner: false,
//       isInviteAccepted: true,
//       partyId: partyId,
//       userId: userId
//     }).then(res => {
//       done()
//     }).catch(done)
//   })

//   it('Read', done => {
//     model.findOne({
//       where: {
//         isInviteAccepted: true
//       }
//     }).then(res => {
//       done()
//     }).catch(done)
//   })

//   it('Update', done => {
//     model.update(
//       { isOwner: true },
//       { where: { isInviteAccepted: true } }
//     ).then(res => {
//       done()
//     }).catch(done)
//   })

//   it('Delete', done => {
//     model.destroy({
//       where: { isInviteAccepted: true }
//     }).then(res => {
//       done()
//     }).catch(done)
//   })

//   after(() => {
//     userModel.destroy({
//       where: {
//         id: userId
//       }
//     })
//     partyModel.destroy({
//       where: {
//         id: partyId
//       }
//     })
//   })
// })
