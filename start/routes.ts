import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world!!!' }
})

Route.post('login', 'AuthController.login')
Route.post('users', 'UsersController.store')

Route.group(() => {
  Route.get('users', 'UsersController.index')
  Route.get('users/:id', 'UsersController.show')

  Route.resource('bets', 'BetsController')

  Route.resource('games', 'GamesController')

  Route.post('forgot_password', 'ForgotPasswordController.store')
  Route.put('forgot_password', 'ForgotPasswordController.update')
}).middleware('auth')

// .middleware('isAdmin')
