import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'

export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user: User) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('prova@example.com')
      .to(this.user.email)
      .subject('Redefinição de senha')
      .htmlView('emails/forgot_password', { email: this.user.email, token: this.user.token })
  }
}
