import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Profile from 'App/Models/Profile'

export default class CheckProfile {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const profileId = auth.user.$attributes.profileId

    const profile = await Profile.findOrFail(profileId)

    if (profile.profile === 'admin') {
      await next()
    } else {
      response.unauthorized({ error: 'Must be an Admin' })
    }
  }
}
