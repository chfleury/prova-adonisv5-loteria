import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    bets: schema.array().members(
      schema.object().members({
        gameId: schema.number(),
        userId: schema.number(),
        selectedNumbers: schema.string(),
      })
    ),
  })

  public messages = {}
}
