import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'

export default class OfferBetMailer extends BaseMailer {
  constructor(private user: User) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('prova@example.com')
      .to(this.user.email)
      .subject('Você não aposta há 7 dias!')
      .htmlView('emails/offer_bet', {
        email: this.user.email,
      })
  }
}
