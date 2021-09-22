/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const newSchema = schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.confirmed()]),
    })

    try {
      await request.validate({
        schema: newSchema,
      })
    } catch (error) {
      return response.badRequest(error.messages)
    }

    const { email, password } = request.body()
    try {
      const token = await auth.use('api').attempt(email, password)

      return token
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }
}
