import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Game from 'App/Models/Game'

export default class GamesController {
  public async index() {
    return await Game.all()
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await Game.findOrFail(id)
  }

  public async store({ request }: HttpContextContract) {
    const { type, description, range, price, maxNumber, color, minCartValue } = request.body()

    const game = await Game.create({
      type,
      description,
      range,
      price,
      maxNumber,
      color,
      minCartValue,
    })

    return game
  }
}
