import { BaseTask } from 'adonis5-scheduler/build'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import moment from 'moment'

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
    users.forEach(async (user) => {
      await Mail.send((message) => {
        message
          .from('prova@example.com')
          .to(user.email)
          .subject('Você não aposta há 7 dias!')
          .htmlView('emails/offer_bet', {
            email: user.email,
          })
      })
    })

    this.logger.info('Handled')
  }
}
