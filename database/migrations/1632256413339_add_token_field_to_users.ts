import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('token')
      table.timestamp('token_created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('token')
      table.dropColumn('token_created_at')
    })
  }
}
