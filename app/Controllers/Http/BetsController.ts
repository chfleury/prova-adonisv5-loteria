import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

import Bet from 'App/Models/Bet'
import User from 'App/Models/User'
import Game from 'App/Models/Game'

export default class BetsController {
  public async index() {
    return await Bet.all()
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params()
      return await Bet.findOrFail(id)
    } catch (e) {
      return response.badRequest('Invalid id!')
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const trx = await Database.transaction()

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

    try {
      const { gameId, userId, selectedNumbers } = request.body()

      const user = await User.findOrFail(userId)

      const game = await Game.findOrFail(gameId)
      const totalPrice = game.price

      const bet = await (
        await Bet.create({
          gameId,
          userId,
          selectedNumbers,
          totalPrice,
        })
      ).useTransaction(trx)

      user.lastBetAt = DateTime.now()

      await (await user.save()).useTransaction(trx)

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
      await trx.commit()

      return bet
    } catch (e) {
      await trx.rollback()

      return { error: 'error' }
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const newSchema = schema.create({
      gameId: schema.number(),
      userId: schema.number(),
      selectedNumbers: schema.string(),
      isDeleted: schema.boolean(),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

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
