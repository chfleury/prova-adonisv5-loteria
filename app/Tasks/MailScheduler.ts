import { BaseTask } from 'adonis5-scheduler/build'
import Database from '@ioc:Adonis/Lucid/Database'
import moment from 'moment'

import OfferBetMailer from 'App/Mailers/OfferBetMailer'

export default class MailScheduler extends BaseTask {
  public static get schedule() {
    return '0 0 9 * * *'
    // return '*/1 * * * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    const lastWeek = moment().startOf('day').subtract('7', 'days').toDate()

    const users = await Database.query()
      .from('users')
      .select('*')
      .where('last_bet_at', '<', lastWeek)

    console.log(users)

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      await new OfferBetMailer(user).send()
    }

    this.logger.info('Handled')
  }
}
