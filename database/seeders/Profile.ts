import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Profile from 'App/Models/Profile'

export default class ProfileSeeder extends BaseSeeder {
  public async run() {
    await Profile.createMany([
      {
        profile: 'admin',
      },
      {
        profile: 'player',
      },
    ])
  }
}
