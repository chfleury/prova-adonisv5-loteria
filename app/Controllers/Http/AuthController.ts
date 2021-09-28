/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserValidator from 'App/Validators/UserValidator'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    await request.validate(UserValidator)

    const { email, password } = request.body()
    try {
      const token = await auth.use('api').attempt(email, password)

      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
