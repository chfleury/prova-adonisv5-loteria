import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}),
    description: schema.string({}),
    range: schema.number(),
    price: schema.number(),
    maxNumber: schema.number(),
    color: schema.string({}),
    minCartValue: schema.number(),
  })

  public messages = {}
}
