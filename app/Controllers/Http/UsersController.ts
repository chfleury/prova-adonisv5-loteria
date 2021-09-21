import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    return await User.all()
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await User.findOrFail(id)
  }

  public async store({ request }: HttpContextContract) {
    const { email, password } = request.body()

    const user = await User.create({
      email,
      password,
      profileId: 2,
    })

    return user
  }

  public async update({ request }: HttpContextContract) {
    const { email, password } = request.body()
    const { id } = request.params()

    const user = await User.findOrFail(id)

    email ? (user.email = email) : null
    password ? (user.email = password) : null
    return user
  }

  public async destroy({}: HttpContextContract) {
    // const { id } = request.params()
    return 'destroy'
  }
}
