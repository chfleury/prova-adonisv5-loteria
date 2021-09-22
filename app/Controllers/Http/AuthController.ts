/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    // const email = request.input('email')
    // const password = request.input('password')
    const { email, password } = request.body()
    try {
      const token = await auth.use('api').attempt(email, password)

      const user = await User.findByOrFail('email', email)
      user.lastLoginAt = DateTime.now()
      await user.save()
      // console.log(token.user.$attributes.id)
      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
