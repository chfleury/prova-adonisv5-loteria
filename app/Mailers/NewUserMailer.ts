import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'

export default class NewUser extends BaseMailer {
  constructor(private user: User) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('prova@example.com')
      .to(this.user.email)
      .subject('Cadastro realizado')
      .htmlView('emails/user_registered', { email: this.user.email })
  }
}
