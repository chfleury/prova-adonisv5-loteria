import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    gameId: schema.number(),
    userId: schema.number(),
    selectedNumbers: schema.string(),
    isDeleted: schema.boolean(),
  })

  public messages = {}
}
