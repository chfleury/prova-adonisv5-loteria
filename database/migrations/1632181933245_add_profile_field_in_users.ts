import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddProfileFieldInUsers extends BaseSchema {
  protected tableName = 'add_profile_field_in_users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('profile_id').unsigned().references('profiles.id').onDelete('SET NULL') // delete profile when user is deleted
    })
  }
}
