import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

import Hash from '@ioc:Adonis/Core/Hash'

import Profile from 'App/Models/Profile'
import Bet from 'App/Models/Bet'

export default class User extends BaseModel {
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @hasMany(() => Bet)
  public bet: HasMany<typeof Bet>

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public profileId: number

  @column()
  public password: string

  @column()
  public token: string

  @column.dateTime({})
  public tokenCreatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public lastBetAt: DateTime
}
