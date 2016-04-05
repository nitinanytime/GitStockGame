'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Player = mongoose.model('Player'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, player;

/**
 * Player routes tests
 */
describe('Player CRUD tests', function () {

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

    // Save a user to the test db and create new Player
    user.save(function () {
      player = {
        name: 'Player name'
      };

      done();
    });
  });

  it('should be able to save a Player if logged in', function (done) {
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

        // Save a new Player
        agent.post('/api/players')
          .send(player)
          .expect(200)
          .end(function (playerSaveErr, playerSaveRes) {
            // Handle Player save error
            if (playerSaveErr) {
              return done(playerSaveErr);
            }

            // Get a list of Players
            agent.get('/api/players')
              .end(function (playersGetErr, playersGetRes) {
                // Handle Player save error
                if (playersGetErr) {
                  return done(playersGetErr);
                }

                // Get Players list
                var players = playersGetRes.body;

                // Set assertions
                (players[0].user._id).should.equal(userId);
                (players[0].name).should.match('Player name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Player if not logged in', function (done) {
    agent.post('/api/players')
      .send(player)
      .expect(403)
      .end(function (playerSaveErr, playerSaveRes) {
        // Call the assertion callback
        done(playerSaveErr);
      });
  });

  it('should not be able to save an Player if no name is provided', function (done) {
    // Invalidate name field
    player.name = '';

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

        // Save a new Player
        agent.post('/api/players')
          .send(player)
          .expect(400)
          .end(function (playerSaveErr, playerSaveRes) {
            // Set message assertion
            (playerSaveRes.body.message).should.match('Please fill Player name');

            // Handle Player save error
            done(playerSaveErr);
          });
      });
  });

  it('should be able to update an Player if signed in', function (done) {
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

        // Save a new Player
        agent.post('/api/players')
          .send(player)
          .expect(200)
          .end(function (playerSaveErr, playerSaveRes) {
            // Handle Player save error
            if (playerSaveErr) {
              return done(playerSaveErr);
            }

            // Update Player name
            player.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Player
            agent.put('/api/players/' + playerSaveRes.body._id)
              .send(player)
              .expect(200)
              .end(function (playerUpdateErr, playerUpdateRes) {
                // Handle Player update error
                if (playerUpdateErr) {
                  return done(playerUpdateErr);
                }

                // Set assertions
                (playerUpdateRes.body._id).should.equal(playerSaveRes.body._id);
                (playerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Players if not signed in', function (done) {
    // Create new Player model instance
    var playerObj = new Player(player);

    // Save the player
    playerObj.save(function () {
      // Request Players
      request(app).get('/api/players')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Player if not signed in', function (done) {
    // Create new Player model instance
    var playerObj = new Player(player);

    // Save the Player
    playerObj.save(function () {
      request(app).get('/api/players/' + playerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', player.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Player with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/players/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Player is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Player which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Player
    request(app).get('/api/players/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Player with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Player if signed in', function (done) {
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

        // Save a new Player
        agent.post('/api/players')
          .send(player)
          .expect(200)
          .end(function (playerSaveErr, playerSaveRes) {
            // Handle Player save error
            if (playerSaveErr) {
              return done(playerSaveErr);
            }

            // Delete an existing Player
            agent.delete('/api/players/' + playerSaveRes.body._id)
              .send(player)
              .expect(200)
              .end(function (playerDeleteErr, playerDeleteRes) {
                // Handle player error error
                if (playerDeleteErr) {
                  return done(playerDeleteErr);
                }

                // Set assertions
                (playerDeleteRes.body._id).should.equal(playerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Player if not signed in', function (done) {
    // Set Player user
    player.user = user;

    // Create new Player model instance
    var playerObj = new Player(player);

    // Save the Player
    playerObj.save(function () {
      // Try deleting Player
      request(app).delete('/api/players/' + playerObj._id)
        .expect(403)
        .end(function (playerDeleteErr, playerDeleteRes) {
          // Set message assertion
          (playerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Player error error
          done(playerDeleteErr);
        });

    });
  });

  it('should be able to get a single Player that has an orphaned user reference', function (done) {
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

          // Save a new Player
          agent.post('/api/players')
            .send(player)
            .expect(200)
            .end(function (playerSaveErr, playerSaveRes) {
              // Handle Player save error
              if (playerSaveErr) {
                return done(playerSaveErr);
              }

              // Set assertions on new Player
              (playerSaveRes.body.name).should.equal(player.name);
              should.exist(playerSaveRes.body.user);
              should.equal(playerSaveRes.body.user._id, orphanId);

              // force the Player to have an orphaned user reference
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

                    // Get the Player
                    agent.get('/api/players/' + playerSaveRes.body._id)
                      .expect(200)
                      .end(function (playerInfoErr, playerInfoRes) {
                        // Handle Player error
                        if (playerInfoErr) {
                          return done(playerInfoErr);
                        }

                        // Set assertions
                        (playerInfoRes.body._id).should.equal(playerSaveRes.body._id);
                        (playerInfoRes.body.name).should.equal(player.name);
                        should.equal(playerInfoRes.body.user, undefined);

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
      Player.remove().exec(done);
    });
  });
});
