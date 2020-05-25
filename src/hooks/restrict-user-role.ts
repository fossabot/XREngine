import { HookContext } from '@feathersjs/feathers'
import config from 'config'

// Get the logged in user entity
const loggedInUserEntity: string = config.get('authentication.entity') || 'user'

// This will attach the owner ID in the contact while creating/updating list item
export default (userRole: string) => {
  return async (context: HookContext) => {
    // Getting logged in user and attaching owner of user
    const loggedInUser = context.params[loggedInUserEntity]
    const user = await context.app.service('user').get(loggedInUser.userId)
    if (user.userRole !== userRole) {
      throw new Error('Must be admin to access this function')
    }

    return context
  }
}
