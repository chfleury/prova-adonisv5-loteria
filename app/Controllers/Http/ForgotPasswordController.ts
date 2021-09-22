import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto'
import Mail from '@ioc:Adonis/Addons/Mail'
import moment from 'moment'

import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class ForgotPasswordController {
  public async store({ request }: HttpContextContract) {
    const { email } = request.body()

    const user = await User.findByOrFail('email', email)

    user.token = crypto.randomBytes(10).toString('hex')
    user.tokenCreatedAt = DateTime.now()

    await user.save()

    await Mail.send((message) => {
      message
        .from('prova@example.com')
        .to(user.email)
        .subject('Redefinição de senha')
        .htmlView('emails/forgot_password', { email: user.email, token: user.token })
    })
  }

  public async update({ request, response }: HttpContextContract) {
    const { token, password } = request.body()

    const user = await User.findByOrFail('token', token)

    const tokenExpired = moment().subtract('2', 'days').isAfter(user.tokenCreatedAt)

    if (tokenExpired) {
      return response.status(401).send({ error: 'Token expirado' })
    }

    user.token = null
    user.tokenCreatedAt = null
    user.password = password

    await user.save
  }
}
