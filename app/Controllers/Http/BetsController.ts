import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import Game from 'App/Models/Game'

export default class BetsController {
  public async index() {
    return await Bet.all()
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await Bet.findOrFail(id)
  }

  public async store({ request, response }: HttpContextContract) {
    const newSchema = schema.create({
      gameId: schema.number(),
      userId: schema.number(),
      selectedNumbers: schema.string(),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

    const { gameId, userId, selectedNumbers } = request.body()

    const user = await User.findOrFail(userId)

    const game = await Game.findOrFail(gameId)
    const totalPrice = game.price

    const bet = await Bet.create({
      gameId,
      userId,
      selectedNumbers,
      totalPrice,
    })

    user.lastBetAt = DateTime.now()

    await user.save()

    await Mail.send((message) => {
      message
        .from('prova@example.com')
        .to(user.email)
        .subject('Nova aposta realizada')
        .htmlView('emails/new_bet', {
          email: user.email,
          gameType: game.type,
          selectedNumbers,
          totalPrice,
        })
    })

    return bet
  }
}
