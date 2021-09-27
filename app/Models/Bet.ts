import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import Game from 'App/Models/Game'

export default class Bet extends BaseModel {
  @beforeCreate()
  public static async setIsDeletedAsFalse(bet: Bet) {
    bet.isDeleted = false
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>

  @column({ isPrimary: true })
  public id: number

  @column()
  public gameId: number

  @column()
  public userId: number

  @column()
  public selectedNumbers: string

  @column()
  public totalPrice: number

  @column()
  public isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
