'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Lineup = mongoose.model('Lineup'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, lineup;

/**
 * Lineup routes tests
 */
describe('Lineup CRUD tests', function () {

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

    // Save a user to the test db and create new Lineup
    user.save(function () {
      lineup = {
        name: 'Lineup name'
      };

      done();
    });
  });

  it('should be able to save a Lineup if logged in', function (done) {
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

        // Save a new Lineup
        agent.post('/api/lineups')
          .send(lineup)
          .expect(200)
          .end(function (lineupSaveErr, lineupSaveRes) {
            // Handle Lineup save error
            if (lineupSaveErr) {
              return done(lineupSaveErr);
            }

            // Get a list of Lineups
            agent.get('/api/lineups')
              .end(function (lineupsGetErr, lineupsGetRes) {
                // Handle Lineup save error
                if (lineupsGetErr) {
                  return done(lineupsGetErr);
                }

                // Get Lineups list
                var lineups = lineupsGetRes.body;

                // Set assertions
                (lineups[0].user._id).should.equal(userId);
                (lineups[0].name).should.match('Lineup name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Lineup if not logged in', function (done) {
    agent.post('/api/lineups')
      .send(lineup)
      .expect(403)
      .end(function (lineupSaveErr, lineupSaveRes) {
        // Call the assertion callback
        done(lineupSaveErr);
      });
  });

  it('should not be able to save an Lineup if no name is provided', function (done) {
    // Invalidate name field
    lineup.name = '';

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

        // Save a new Lineup
        agent.post('/api/lineups')
          .send(lineup)
          .expect(400)
          .end(function (lineupSaveErr, lineupSaveRes) {
            // Set message assertion
            (lineupSaveRes.body.message).should.match('Please fill Lineup name');

            // Handle Lineup save error
            done(lineupSaveErr);
          });
      });
  });

  it('should be able to update an Lineup if signed in', function (done) {
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

        // Save a new Lineup
        agent.post('/api/lineups')
          .send(lineup)
          .expect(200)
          .end(function (lineupSaveErr, lineupSaveRes) {
            // Handle Lineup save error
            if (lineupSaveErr) {
              return done(lineupSaveErr);
            }

            // Update Lineup name
            lineup.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Lineup
            agent.put('/api/lineups/' + lineupSaveRes.body._id)
              .send(lineup)
              .expect(200)
              .end(function (lineupUpdateErr, lineupUpdateRes) {
                // Handle Lineup update error
                if (lineupUpdateErr) {
                  return done(lineupUpdateErr);
                }

                // Set assertions
                (lineupUpdateRes.body._id).should.equal(lineupSaveRes.body._id);
                (lineupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Lineups if not signed in', function (done) {
    // Create new Lineup model instance
    var lineupObj = new Lineup(lineup);

    // Save the lineup
    lineupObj.save(function () {
      // Request Lineups
      request(app).get('/api/lineups')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Lineup if not signed in', function (done) {
    // Create new Lineup model instance
    var lineupObj = new Lineup(lineup);

    // Save the Lineup
    lineupObj.save(function () {
      request(app).get('/api/lineups/' + lineupObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', lineup.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Lineup with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/lineups/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Lineup is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Lineup which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Lineup
    request(app).get('/api/lineups/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Lineup with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Lineup if signed in', function (done) {
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

        // Save a new Lineup
        agent.post('/api/lineups')
          .send(lineup)
          .expect(200)
          .end(function (lineupSaveErr, lineupSaveRes) {
            // Handle Lineup save error
            if (lineupSaveErr) {
              return done(lineupSaveErr);
            }

            // Delete an existing Lineup
            agent.delete('/api/lineups/' + lineupSaveRes.body._id)
              .send(lineup)
              .expect(200)
              .end(function (lineupDeleteErr, lineupDeleteRes) {
                // Handle lineup error error
                if (lineupDeleteErr) {
                  return done(lineupDeleteErr);
                }

                // Set assertions
                (lineupDeleteRes.body._id).should.equal(lineupSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Lineup if not signed in', function (done) {
    // Set Lineup user
    lineup.user = user;

    // Create new Lineup model instance
    var lineupObj = new Lineup(lineup);

    // Save the Lineup
    lineupObj.save(function () {
      // Try deleting Lineup
      request(app).delete('/api/lineups/' + lineupObj._id)
        .expect(403)
        .end(function (lineupDeleteErr, lineupDeleteRes) {
          // Set message assertion
          (lineupDeleteRes.body.message).should.match('User is not authorized');

          // Handle Lineup error error
          done(lineupDeleteErr);
        });

    });
  });

  it('should be able to get a single Lineup that has an orphaned user reference', function (done) {
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

          // Save a new Lineup
          agent.post('/api/lineups')
            .send(lineup)
            .expect(200)
            .end(function (lineupSaveErr, lineupSaveRes) {
              // Handle Lineup save error
              if (lineupSaveErr) {
                return done(lineupSaveErr);
              }

              // Set assertions on new Lineup
              (lineupSaveRes.body.name).should.equal(lineup.name);
              should.exist(lineupSaveRes.body.user);
              should.equal(lineupSaveRes.body.user._id, orphanId);

              // force the Lineup to have an orphaned user reference
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

                    // Get the Lineup
                    agent.get('/api/lineups/' + lineupSaveRes.body._id)
                      .expect(200)
                      .end(function (lineupInfoErr, lineupInfoRes) {
                        // Handle Lineup error
                        if (lineupInfoErr) {
                          return done(lineupInfoErr);
                        }

                        // Set assertions
                        (lineupInfoRes.body._id).should.equal(lineupSaveRes.body._id);
                        (lineupInfoRes.body.name).should.equal(lineup.name);
                        should.equal(lineupInfoRes.body.user, undefined);

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
      Lineup.remove().exec(done);
    });
  });
});
