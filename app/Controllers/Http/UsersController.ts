import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    return await User.all()
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await User.findOrFail(id)
  }

  public async store({ request, response }: HttpContextContract) {
    const newSchema = schema.create({
      email: schema.string({}, [rules.email]),
      password: schema.string({}, [rules.confirmed()]),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

    const { email, password } = request.body()

    const user = await User.create({
      email,
      password,
      profileId: 2,
    })

    await Mail.send((message) => {
      message
        .from('prova@example.com')
        .to(user.email)
        .subject('Cadastro realizado')
        .htmlView('emails/user_registered', { email: user.email })
    })

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const newSchema = schema.create({
      email: schema.string({}, [rules.email]),
      password: schema.string({}, [rules.confirmed()]),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

    const { email, password } = request.body()
    const { id } = request.params()

    const user = await User.findOrFail(id)

    email ? (user.email = email) : null
    password ? (user.email = password) : null
    return user
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()

    try {
      const user = await User.findOrFail(id)
      await user.delete()

      return { message: 'Delete sucessful' }
    } catch (e) {
      return response.badRequest('Invalid id!')
    }
  }
}
