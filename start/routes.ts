import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world!!!' }
})

Route.post('login', 'AuthController.login')
Route.post('users', 'UsersController.store')

Route.group(() => {
  Route.get('users', 'UsersController.index')
  Route.get('users/:id', 'UsersController.show')
  Route.put('users/:id', 'UsersController.update')
  Route.delete('users/:id', 'Userscontroller.destroy')

  Route.resource('bets', 'BetsController')

  Route.get('games', 'GamesController.index')
  Route.get('games/:id', 'GamesController.show')

  Route.post('forgot_password', 'ForgotPasswordController.store')
  Route.put('forgot_password', 'ForgotPasswordController.update')

  Route.group(() => {
    Route.post('/', 'GamesController.store')
    Route.put('/:id', 'GamesController.update')
    Route.delete('/:id', 'GamesController.destroy')
  })
    .prefix('games')
    .middleware('isAdmin')
}).middleware('auth')
