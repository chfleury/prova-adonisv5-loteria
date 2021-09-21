import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class Bet extends BaseModel {
  @beforeCreate()
  public static async setIsDeletedAsFalse(bet: Bet) {
    bet.isDeleted = false
  }

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
