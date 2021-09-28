import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/User'
import Game from 'App/Models/Game'

export default class NewBetMailer extends BaseMailer {
  constructor(
    private user: User,
    private game: Game,
    private selectedNumbers: number,
    private totalPrice: number
  ) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('prova@example.com')
      .to(this.user.email)
      .subject('Nova aposta realizada')
      .htmlView('emails/new_bet', {
        email: this.user.email,
        gameType: this.game.type,
        selectedNumbers: this.selectedNumbers,
        totalPrice: this.totalPrice,
      })
  }
}
