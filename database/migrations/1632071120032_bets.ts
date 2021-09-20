import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bets extends BaseSchema {
  protected tableName = 'bets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE') // delete profile when user is deleted
      table.integer('game_id').unsigned().references('games.id').onDelete('SET NULL') // delete profile when user is deleted
      table.string('selected_numbers').notNullable()
      table.string('total_price').notNullable()
      table.boolean('is_deleted').defaultTo(false).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
