import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index() {
    return await Bet.all()
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await Bet.findOrFail(id)
  }

  public async store({ request }: HttpContextContract) {
    const { gameId, userId, selectedNumbers, totalPrice } = request.body()

    const bet = await Bet.create({
      gameId,
      userId,
      selectedNumbers,
      totalPrice,
    })

    return bet
  }
}
