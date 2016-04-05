'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Game = mongoose.model('Game'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, game;

/**
 * Game routes tests
 */
describe('Game CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Game
    user.save(function () {
      game = {
        name: 'Game name'
      };

      done();
    });
  });

  it('should be able to save a Game if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Game
        agent.post('/api/games')
          .send(game)
          .expect(200)
          .end(function (gameSaveErr, gameSaveRes) {
            // Handle Game save error
            if (gameSaveErr) {
              return done(gameSaveErr);
            }

            // Get a list of Games
            agent.get('/api/games')
              .end(function (gamesGetErr, gamesGetRes) {
                // Handle Game save error
                if (gamesGetErr) {
                  return done(gamesGetErr);
                }

                // Get Games list
                var games = gamesGetRes.body;

                // Set assertions
                (games[0].user._id).should.equal(userId);
                (games[0].name).should.match('Game name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Game if not logged in', function (done) {
    agent.post('/api/games')
      .send(game)
      .expect(403)
      .end(function (gameSaveErr, gameSaveRes) {
        // Call the assertion callback
        done(gameSaveErr);
      });
  });

  it('should not be able to save an Game if no name is provided', function (done) {
    // Invalidate name field
    game.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Game
        agent.post('/api/games')
          .send(game)
          .expect(400)
          .end(function (gameSaveErr, gameSaveRes) {
            // Set message assertion
            (gameSaveRes.body.message).should.match('Please fill Game name');

            // Handle Game save error
            done(gameSaveErr);
          });
      });
  });

  it('should be able to update an Game if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Game
        agent.post('/api/games')
          .send(game)
          .expect(200)
          .end(function (gameSaveErr, gameSaveRes) {
            // Handle Game save error
            if (gameSaveErr) {
              return done(gameSaveErr);
            }

            // Update Game name
            game.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Game
            agent.put('/api/games/' + gameSaveRes.body._id)
              .send(game)
              .expect(200)
              .end(function (gameUpdateErr, gameUpdateRes) {
                // Handle Game update error
                if (gameUpdateErr) {
                  return done(gameUpdateErr);
                }

                // Set assertions
                (gameUpdateRes.body._id).should.equal(gameSaveRes.body._id);
                (gameUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Games if not signed in', function (done) {
    // Create new Game model instance
    var gameObj = new Game(game);

    // Save the game
    gameObj.save(function () {
      // Request Games
      request(app).get('/api/games')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Game if not signed in', function (done) {
    // Create new Game model instance
    var gameObj = new Game(game);

    // Save the Game
    gameObj.save(function () {
      request(app).get('/api/games/' + gameObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', game.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Game with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/games/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Game is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Game which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Game
    request(app).get('/api/games/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Game with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Game if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Game
        agent.post('/api/games')
          .send(game)
          .expect(200)
          .end(function (gameSaveErr, gameSaveRes) {
            // Handle Game save error
            if (gameSaveErr) {
              return done(gameSaveErr);
            }

            // Delete an existing Game
            agent.delete('/api/games/' + gameSaveRes.body._id)
              .send(game)
              .expect(200)
              .end(function (gameDeleteErr, gameDeleteRes) {
                // Handle game error error
                if (gameDeleteErr) {
                  return done(gameDeleteErr);
                }

                // Set assertions
                (gameDeleteRes.body._id).should.equal(gameSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Game if not signed in', function (done) {
    // Set Game user
    game.user = user;

    // Create new Game model instance
    var gameObj = new Game(game);

    // Save the Game
    gameObj.save(function () {
      // Try deleting Game
      request(app).delete('/api/games/' + gameObj._id)
        .expect(403)
        .end(function (gameDeleteErr, gameDeleteRes) {
          // Set message assertion
          (gameDeleteRes.body.message).should.match('User is not authorized');

          // Handle Game error error
          done(gameDeleteErr);
        });

    });
  });

  it('should be able to get a single Game that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Game
          agent.post('/api/games')
            .send(game)
            .expect(200)
            .end(function (gameSaveErr, gameSaveRes) {
              // Handle Game save error
              if (gameSaveErr) {
                return done(gameSaveErr);
              }

              // Set assertions on new Game
              (gameSaveRes.body.name).should.equal(game.name);
              should.exist(gameSaveRes.body.user);
              should.equal(gameSaveRes.body.user._id, orphanId);

              // force the Game to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Game
                    agent.get('/api/games/' + gameSaveRes.body._id)
                      .expect(200)
                      .end(function (gameInfoErr, gameInfoRes) {
                        // Handle Game error
                        if (gameInfoErr) {
                          return done(gameInfoErr);
                        }

                        // Set assertions
                        (gameInfoRes.body._id).should.equal(gameSaveRes.body._id);
                        (gameInfoRes.body.name).should.equal(game.name);
                        should.equal(gameInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Game.remove().exec(done);
    });
  });
});
