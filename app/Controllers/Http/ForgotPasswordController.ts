import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto'
import Mail from '@ioc:Adonis/Addons/Mail'
import moment from 'moment'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

import User from 'App/Models/User'

export default class ForgotPasswordController {
  public async store({ request, response }: HttpContextContract) {
    const newSchema = schema.create({
      email: schema.string({}, [rules.email()]),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

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
    const newSchema = schema.create({
      token: schema.string({}),
      password: schema.string({}, [rules.confirmed()]),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }
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
