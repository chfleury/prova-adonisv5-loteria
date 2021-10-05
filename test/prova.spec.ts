import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  // test('ensure home page works', async () => {
  //   await supertest(BASE_URL).get('/').expect(200)
  // })

  // test('ensure user password gets hashed during save', async (assert) => {
  //   const user = new User()
  //   user.email = 'virk@adonisjs.com'
  //   user.password = 'secret'
  //   await user.save()

  //   assert.notEqual(user.password, 'secret')
  // })

  test('create user', async () => {
    await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'christiasn@gmail.com',
        password: 'senha',
        password_confirmation: 'senha',
      })
      .expect(200)
  })

  test('login user', async () => {
    await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'christiasn@gmail.com',
        password: 'senha',
        password_confirmation: 'senha',
      })
      .expect(200)
  })

  test('game CRUD', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'admin',
        password_confirmation: 'admin',
      })
      .expect(200)

    const token = response.body['token']

    // CREATE GAME
    const gameResponse = await supertest(BASE_URL)
      .post('/games')
      .send({
        type: 'megasena',
        description: 'descricao quina',
        range: 80,
        price: 2.5,
        maxNumber: 12,
        color: 'FFF',
        minCartValue: 12.5,
      })
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    var game = gameResponse.body
    const gameId = game.id
    // UPDATE GAME
    await supertest(BASE_URL)
      .put('/games/' + gameId)
      .send({
        type: 'megasena',
        description: 'descricao megasena',
        range: 80,
        price: 2.5,
        maxNumber: 12,
        color: 'FFF',
        minCartValue: 12.5,
      })
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    // GET GAME BY ID
    game = await supertest(BASE_URL)
      .get('/games/' + gameId)
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    assert.equal(game.body.type, 'megasena')

    // GET ALL GAMES
    var games = await supertest(BASE_URL)
      .get('/games')
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    assert.equal(games.body[0].type, 'megasena')
    assert.equal(games.body.length, 1)

    // DELETE GAMES

    await supertest(BASE_URL)
      .delete('/games/' + gameId)
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    // Now our game list should return 0 games
    games = await supertest(BASE_URL)
      .get('/games')
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    assert.equal(games.body.length, 0)
  })

  test('create bet', async () => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'admin',
        password_confirmation: 'admin',
      })
      .expect(200)

    const token = response.body['token']

    const gameResponse = await supertest(BASE_URL)
      .post('/games')
      .send({
        type: 'Mega-Sena',
        description: 'descricao megasena',
        range: 80,
        price: 2.5,
        maxNumber: 12,
        color: 'FFF',
        minCartValue: 2.5,
      })
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    var game = gameResponse.body

    var selectedNumbers = []
    for (var i = 0; i < game.max_number; i++) {
      var randomnumber = Math.floor(Math.random() * (80 - 1 + 1)) + 1

      if (selectedNumbers.includes(randomnumber)) {
        i--
      } else {
        selectedNumbers.push(randomnumber)
      }
    }

    selectedNumbers.sort(function (a, b) {
      return a - b
    })

    console.log(
      await supertest(BASE_URL)
        .post('/bets')
        .send({
          bets: [
            {
              gameId: game.id,
              userId: 1,
              selectedNumbers: selectedNumbers.join(''),
            },
          ],
        })
        .set('Authorization', 'bearer ' + token)
        .expect(200)
    )
  })
})
