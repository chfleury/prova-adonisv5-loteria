import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Game from 'App/Models/Game'

export default class GamesController {
  public async index() {
    return await Game.all()
  }

  public async show({ request }: HttpContextContract) {
    const { id } = request.params()

    return await Game.findOrFail(id)
  }

  public async store({ request, response }: HttpContextContract) {
    const newSchema = schema.create({
      type: schema.string({}),
      description: schema.string({}),
      range: schema.number(),
      price: schema.number(),
      maxNumber: schema.number(),
      color: schema.string({}),
      minCartValue: schema.number(),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

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

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const newSchema = schema.create({
      type: schema.string({}),
      description: schema.string({}),
      range: schema.string({}),
      price: schema.number(),
      maxNumber: schema.number(),
      color: schema.string({}),
      minCartValue: schema.number(),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

    const { type, description, range, price, maxNumber, color, minCartValue } = request.body()

    const game = await Game.findOrFail(id)

    game.type = type
    game.description = description
    game.range = range
    game.maxNumber = maxNumber
    game.price = price
    game.color = color
    game.minCartValue = minCartValue

    return await game.save()
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()

    try {
      const game = await Game.findOrFail(id)
      await game.delete()

      return { message: 'Delete sucessful' }
    } catch (e) {
      return response.badRequest('Invalid id!')
    }
  }
}
