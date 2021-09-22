/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world!!!' }
})

Route.post('login', 'AuthController.login')
Route.post('users', 'UsersController.store')

// Route.group(() => {
//  Route.resource('users', 'UserController')

// }).prefix('/users')

Route.group(() => {
  Route.get('users', 'UsersController.index')
  Route.get('users/:id', 'UsersController.show')

  Route.resource('bets', 'BetsController')
  Route.resource('games', 'GamesController')

  Route.post('forgot_password', 'ForgotPasswordController.store')
  Route.put('forgot_password', 'ForgotPasswordController.update')
}).middleware('auth')
