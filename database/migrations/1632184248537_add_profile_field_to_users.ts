import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('profile_id').unsigned().references('profiles.id').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('profile_id')
    })
  }
}
