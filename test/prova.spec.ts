import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Testes prova', () => {
  test('it should create user', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'christiasn@gmail.com',
        password: 'senha',
        password_confirmation: 'senha',
      })
      .expect(200)

    const user = response.body

    // because id 1 is already admin user created by seeds
    assert.equal(user.id, 2)
    assert.equal(user.email, 'christiasn@gmail.com')
  })

  test('it should login user', async () => {
    await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'christiasn@gmail.com',
        password: 'senha',
        password_confirmation: 'senha',
      })
      .expect(200)
  })

  test('it should CRUD game ', async (assert) => {
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
        type: 'quina',
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
        type: 'lotofacil',
        description: 'descricao lotofacil',
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

    assert.equal(game.body.type, 'lotofacil')

    // GET ALL GAMES
    var games = await supertest(BASE_URL)
      .get('/games')
      .set('Authorization', 'bearer ' + token)
      .expect(200)

    assert.equal(games.body[0].type, 'lotofacil')
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

  test('it should create bet', async (assert) => {
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

    const bet = await supertest(BASE_URL)
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

    assert.equal(bet.body[0].gameId, 2)
    assert.equal(bet.body[0].userId, 1)
  })
})
