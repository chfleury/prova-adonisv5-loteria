import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto'
import moment from 'moment'
import { DateTime } from 'luxon'

import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import EmailValidator from 'App/Validators/EmailValidator'
import ForgotPasswordMailer from 'App/Mailers/ForgotPasswordMailer'

export default class ForgotPasswordController {
  public async store({ request }: HttpContextContract) {
    await request.validate(EmailValidator)
    const { email } = request.body()

    const user = await User.findByOrFail('email', email)

    user.token = crypto.randomBytes(10).toString('hex')
    user.tokenCreatedAt = DateTime.now()

    await user.save()

    await new ForgotPasswordMailer(user).sendLater()
  }

  public async update({ request, response }: HttpContextContract) {
    await request.validate(UserValidator)

    try {
      const { token, password } = request.body()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('15', 'days').isAfter(user.tokenCreatedAt)

      if (tokenExpired) {
        return response.status(401).send({ error: 'Token expirado' })
      }

      user.token = null
      user.tokenCreatedAt = null
      user.password = password

      await user.save()
      return user
    } catch (error) {
      return { error: 'Please retry with valid token (the token expires in 15 days)' }
    }
  }
}
