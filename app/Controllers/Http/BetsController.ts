import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import Game from 'App/Models/Game'
import CreateBetValidator from 'App/Validators/CreateBetValidator'
import UpdateBetValidator from 'App/Validators/UpdateBetValidator'
import NewBetMailer from 'App/Mailers/NewBetMailer'

export default class BetsController {
  public async index() {
    return await Bet.query().preload('game').preload('user')
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params()
      return await Bet.query().where('id', id).preload('user').preload('game')
    } catch (e) {
      return response.badRequest('Invalid id!')
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateBetValidator)

    // const trx = await Database.transaction()

    try {
      const bets = request.body().bets

      const user = await User.findOrFail(bets[0].userId)

      // user.useTransaction(trx)

      for (let i = 0; i < bets.length; i++) {
        const bet = bets[i]
        const game = await Game.findOrFail(bet.gameId)

        const selectedNumbers = bet.selectedNumbers
        const totalPrice = game.price

        await Bet.create(
          {
            gameId: game.id,
            userId: user.id,
            selectedNumbers,
            totalPrice,
          }
          // { client: trx }
        )

        await new NewBetMailer(user, game, selectedNumbers, totalPrice).sendLater()
      }

      user.lastBetAt = DateTime.now()

      await user.save()

      // await trx.commit()
      return bets
    } catch (e) {
      // await trx.rollback()

      response.status(400)
      return { error: 'Verify if game and user id are correct' }
    }
  }

  public async update({ request, response }: HttpContextContract) {
    await request.validate(UpdateBetValidator)

    const { id } = request.params()

    try {
      const { gameId, userId, selectedNumbers, isDeleted } = request.body()
      const bet = await Bet.findOrFail(id)
      bet.gameId = gameId
      bet.userId = userId
      bet.selectedNumbers = selectedNumbers
      bet.isDeleted = isDeleted
      await bet.save()

      return bet
    } catch (e) {
      return response.badRequest('Invalid id!')
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()

    try {
      const bet = await Bet.findOrFail(id)
      bet.isDeleted = true
      await bet.save()

      return bet
    } catch (e) {
      return response.badRequest('Invalid id!')
    }
  }
}
