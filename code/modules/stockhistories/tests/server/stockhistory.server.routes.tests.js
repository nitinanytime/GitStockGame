'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Stockhistory = mongoose.model('Stockhistory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, stockhistory;

/**
 * Stockhistory routes tests
 */
describe('Stockhistory CRUD tests', function () {

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

    // Save a user to the test db and create new Stockhistory
    user.save(function () {
      stockhistory = {
        name: 'Stockhistory name'
      };

      done();
    });
  });

  it('should be able to save a Stockhistory if logged in', function (done) {
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

        // Save a new Stockhistory
        agent.post('/api/stockhistories')
          .send(stockhistory)
          .expect(200)
          .end(function (stockhistorySaveErr, stockhistorySaveRes) {
            // Handle Stockhistory save error
            if (stockhistorySaveErr) {
              return done(stockhistorySaveErr);
            }

            // Get a list of Stockhistories
            agent.get('/api/stockhistories')
              .end(function (stockhistorysGetErr, stockhistorysGetRes) {
                // Handle Stockhistory save error
                if (stockhistorysGetErr) {
                  return done(stockhistorysGetErr);
                }

                // Get Stockhistories list
                var stockhistories = stockhistoriesGetRes.body;

                // Set assertions
                (stockhistories[0].user._id).should.equal(userId);
                (stockhistories[0].name).should.match('Stockhistory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Stockhistory if not logged in', function (done) {
    agent.post('/api/stockhistories')
      .send(stockhistory)
      .expect(403)
      .end(function (stockhistorySaveErr, stockhistorySaveRes) {
        // Call the assertion callback
        done(stockhistorySaveErr);
      });
  });

  it('should not be able to save an Stockhistory if no name is provided', function (done) {
    // Invalidate name field
    stockhistory.name = '';

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

        // Save a new Stockhistory
        agent.post('/api/stockhistories')
          .send(stockhistory)
          .expect(400)
          .end(function (stockhistorySaveErr, stockhistorySaveRes) {
            // Set message assertion
            (stockhistorySaveRes.body.message).should.match('Please fill Stockhistory name');

            // Handle Stockhistory save error
            done(stockhistorySaveErr);
          });
      });
  });

  it('should be able to update an Stockhistory if signed in', function (done) {
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

        // Save a new Stockhistory
        agent.post('/api/stockhistories')
          .send(stockhistory)
          .expect(200)
          .end(function (stockhistorySaveErr, stockhistorySaveRes) {
            // Handle Stockhistory save error
            if (stockhistorySaveErr) {
              return done(stockhistorySaveErr);
            }

            // Update Stockhistory name
            stockhistory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Stockhistory
            agent.put('/api/stockhistories/' + stockhistorySaveRes.body._id)
              .send(stockhistory)
              .expect(200)
              .end(function (stockhistoryUpdateErr, stockhistoryUpdateRes) {
                // Handle Stockhistory update error
                if (stockhistoryUpdateErr) {
                  return done(stockhistoryUpdateErr);
                }

                // Set assertions
                (stockhistoryUpdateRes.body._id).should.equal(stockhistorySaveRes.body._id);
                (stockhistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Stockhistories if not signed in', function (done) {
    // Create new Stockhistory model instance
    var stockhistoryObj = new Stockhistory(stockhistory);

    // Save the stockhistory
    stockhistoryObj.save(function () {
      // Request Stockhistories
      request(app).get('/api/stockhistories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Stockhistory if not signed in', function (done) {
    // Create new Stockhistory model instance
    var stockhistoryObj = new Stockhistory(stockhistory);

    // Save the Stockhistory
    stockhistoryObj.save(function () {
      request(app).get('/api/stockhistories/' + stockhistoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', stockhistory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Stockhistory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/stockhistories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Stockhistory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Stockhistory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Stockhistory
    request(app).get('/api/stockhistories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Stockhistory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Stockhistory if signed in', function (done) {
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

        // Save a new Stockhistory
        agent.post('/api/stockhistories')
          .send(stockhistory)
          .expect(200)
          .end(function (stockhistorySaveErr, stockhistorySaveRes) {
            // Handle Stockhistory save error
            if (stockhistorySaveErr) {
              return done(stockhistorySaveErr);
            }

            // Delete an existing Stockhistory
            agent.delete('/api/stockhistories/' + stockhistorySaveRes.body._id)
              .send(stockhistory)
              .expect(200)
              .end(function (stockhistoryDeleteErr, stockhistoryDeleteRes) {
                // Handle stockhistory error error
                if (stockhistoryDeleteErr) {
                  return done(stockhistoryDeleteErr);
                }

                // Set assertions
                (stockhistoryDeleteRes.body._id).should.equal(stockhistorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Stockhistory if not signed in', function (done) {
    // Set Stockhistory user
    stockhistory.user = user;

    // Create new Stockhistory model instance
    var stockhistoryObj = new Stockhistory(stockhistory);

    // Save the Stockhistory
    stockhistoryObj.save(function () {
      // Try deleting Stockhistory
      request(app).delete('/api/stockhistories/' + stockhistoryObj._id)
        .expect(403)
        .end(function (stockhistoryDeleteErr, stockhistoryDeleteRes) {
          // Set message assertion
          (stockhistoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Stockhistory error error
          done(stockhistoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Stockhistory that has an orphaned user reference', function (done) {
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

          // Save a new Stockhistory
          agent.post('/api/stockhistories')
            .send(stockhistory)
            .expect(200)
            .end(function (stockhistorySaveErr, stockhistorySaveRes) {
              // Handle Stockhistory save error
              if (stockhistorySaveErr) {
                return done(stockhistorySaveErr);
              }

              // Set assertions on new Stockhistory
              (stockhistorySaveRes.body.name).should.equal(stockhistory.name);
              should.exist(stockhistorySaveRes.body.user);
              should.equal(stockhistorySaveRes.body.user._id, orphanId);

              // force the Stockhistory to have an orphaned user reference
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

                    // Get the Stockhistory
                    agent.get('/api/stockhistories/' + stockhistorySaveRes.body._id)
                      .expect(200)
                      .end(function (stockhistoryInfoErr, stockhistoryInfoRes) {
                        // Handle Stockhistory error
                        if (stockhistoryInfoErr) {
                          return done(stockhistoryInfoErr);
                        }

                        // Set assertions
                        (stockhistoryInfoRes.body._id).should.equal(stockhistorySaveRes.body._id);
                        (stockhistoryInfoRes.body.name).should.equal(stockhistory.name);
                        should.equal(stockhistoryInfoRes.body.user, undefined);

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
      Stockhistory.remove().exec(done);
    });
  });
});
