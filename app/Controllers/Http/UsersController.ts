import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'

import User from 'App/Models/User'
import NewUserMailer from 'App/Mailers/NewUserMailer'

export default class UsersController {
  public async index() {
    return await User.query().preload('profile')
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await User.query().where('id', id).preload('profile')
  }

  public async store({ request }: HttpContextContract) {
    await request.validate(UserValidator)

    const { email, password } = request.body()

    const user = await User.create({
      email,
      password,
      profileId: 2,
    })

    await new NewUserMailer(user).sendLater()

    return user
  }

  public async update({ request }: HttpContextContract) {
    await request.validate(UserValidator)

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
