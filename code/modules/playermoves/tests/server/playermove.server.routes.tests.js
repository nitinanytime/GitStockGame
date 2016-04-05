'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Playermove = mongoose.model('Playermove'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, playermove;

/**
 * Playermove routes tests
 */
describe('Playermove CRUD tests', function () {

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

    // Save a user to the test db and create new Playermove
    user.save(function () {
      playermove = {
        name: 'Playermove name'
      };

      done();
    });
  });

  it('should be able to save a Playermove if logged in', function (done) {
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

        // Save a new Playermove
        agent.post('/api/playermoves')
          .send(playermove)
          .expect(200)
          .end(function (playermoveSaveErr, playermoveSaveRes) {
            // Handle Playermove save error
            if (playermoveSaveErr) {
              return done(playermoveSaveErr);
            }

            // Get a list of Playermoves
            agent.get('/api/playermoves')
              .end(function (playermovesGetErr, playermovesGetRes) {
                // Handle Playermove save error
                if (playermovesGetErr) {
                  return done(playermovesGetErr);
                }

                // Get Playermoves list
                var playermoves = playermovesGetRes.body;

                // Set assertions
                (playermoves[0].user._id).should.equal(userId);
                (playermoves[0].name).should.match('Playermove name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Playermove if not logged in', function (done) {
    agent.post('/api/playermoves')
      .send(playermove)
      .expect(403)
      .end(function (playermoveSaveErr, playermoveSaveRes) {
        // Call the assertion callback
        done(playermoveSaveErr);
      });
  });

  it('should not be able to save an Playermove if no name is provided', function (done) {
    // Invalidate name field
    playermove.name = '';

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

        // Save a new Playermove
        agent.post('/api/playermoves')
          .send(playermove)
          .expect(400)
          .end(function (playermoveSaveErr, playermoveSaveRes) {
            // Set message assertion
            (playermoveSaveRes.body.message).should.match('Please fill Playermove name');

            // Handle Playermove save error
            done(playermoveSaveErr);
          });
      });
  });

  it('should be able to update an Playermove if signed in', function (done) {
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

        // Save a new Playermove
        agent.post('/api/playermoves')
          .send(playermove)
          .expect(200)
          .end(function (playermoveSaveErr, playermoveSaveRes) {
            // Handle Playermove save error
            if (playermoveSaveErr) {
              return done(playermoveSaveErr);
            }

            // Update Playermove name
            playermove.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Playermove
            agent.put('/api/playermoves/' + playermoveSaveRes.body._id)
              .send(playermove)
              .expect(200)
              .end(function (playermoveUpdateErr, playermoveUpdateRes) {
                // Handle Playermove update error
                if (playermoveUpdateErr) {
                  return done(playermoveUpdateErr);
                }

                // Set assertions
                (playermoveUpdateRes.body._id).should.equal(playermoveSaveRes.body._id);
                (playermoveUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Playermoves if not signed in', function (done) {
    // Create new Playermove model instance
    var playermoveObj = new Playermove(playermove);

    // Save the playermove
    playermoveObj.save(function () {
      // Request Playermoves
      request(app).get('/api/playermoves')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Playermove if not signed in', function (done) {
    // Create new Playermove model instance
    var playermoveObj = new Playermove(playermove);

    // Save the Playermove
    playermoveObj.save(function () {
      request(app).get('/api/playermoves/' + playermoveObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', playermove.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Playermove with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/playermoves/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Playermove is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Playermove which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Playermove
    request(app).get('/api/playermoves/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Playermove with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Playermove if signed in', function (done) {
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

        // Save a new Playermove
        agent.post('/api/playermoves')
          .send(playermove)
          .expect(200)
          .end(function (playermoveSaveErr, playermoveSaveRes) {
            // Handle Playermove save error
            if (playermoveSaveErr) {
              return done(playermoveSaveErr);
            }

            // Delete an existing Playermove
            agent.delete('/api/playermoves/' + playermoveSaveRes.body._id)
              .send(playermove)
              .expect(200)
              .end(function (playermoveDeleteErr, playermoveDeleteRes) {
                // Handle playermove error error
                if (playermoveDeleteErr) {
                  return done(playermoveDeleteErr);
                }

                // Set assertions
                (playermoveDeleteRes.body._id).should.equal(playermoveSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Playermove if not signed in', function (done) {
    // Set Playermove user
    playermove.user = user;

    // Create new Playermove model instance
    var playermoveObj = new Playermove(playermove);

    // Save the Playermove
    playermoveObj.save(function () {
      // Try deleting Playermove
      request(app).delete('/api/playermoves/' + playermoveObj._id)
        .expect(403)
        .end(function (playermoveDeleteErr, playermoveDeleteRes) {
          // Set message assertion
          (playermoveDeleteRes.body.message).should.match('User is not authorized');

          // Handle Playermove error error
          done(playermoveDeleteErr);
        });

    });
  });

  it('should be able to get a single Playermove that has an orphaned user reference', function (done) {
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

          // Save a new Playermove
          agent.post('/api/playermoves')
            .send(playermove)
            .expect(200)
            .end(function (playermoveSaveErr, playermoveSaveRes) {
              // Handle Playermove save error
              if (playermoveSaveErr) {
                return done(playermoveSaveErr);
              }

              // Set assertions on new Playermove
              (playermoveSaveRes.body.name).should.equal(playermove.name);
              should.exist(playermoveSaveRes.body.user);
              should.equal(playermoveSaveRes.body.user._id, orphanId);

              // force the Playermove to have an orphaned user reference
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

                    // Get the Playermove
                    agent.get('/api/playermoves/' + playermoveSaveRes.body._id)
                      .expect(200)
                      .end(function (playermoveInfoErr, playermoveInfoRes) {
                        // Handle Playermove error
                        if (playermoveInfoErr) {
                          return done(playermoveInfoErr);
                        }

                        // Set assertions
                        (playermoveInfoRes.body._id).should.equal(playermoveSaveRes.body._id);
                        (playermoveInfoRes.body.name).should.equal(playermove.name);
                        should.equal(playermoveInfoRes.body.user, undefined);

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
      Playermove.remove().exec(done);
    });
  });
});
