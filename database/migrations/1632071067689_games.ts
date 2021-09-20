import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Games extends BaseSchema {
  protected tableName = 'games'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('type').unique()
      table.string('description')
      table.integer('range')
      table.decimal('price')
      table.integer('max_number')
      table.string('color')
      table.decimal('min_cart_value')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
