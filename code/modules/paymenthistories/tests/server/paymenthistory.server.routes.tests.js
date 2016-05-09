'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Paymenthistory = mongoose.model('Paymenthistory'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, paymenthistory;

/**
 * Paymenthistory routes tests
 */
describe('Paymenthistory CRUD tests', function () {

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

    // Save a user to the test db and create new Paymenthistory
    user.save(function () {
      paymenthistory = {
        name: 'Paymenthistory name'
      };

      done();
    });
  });

  it('should be able to save a Paymenthistory if logged in', function (done) {
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

        // Save a new Paymenthistory
        agent.post('/api/paymenthistories')
          .send(paymenthistory)
          .expect(200)
          .end(function (paymenthistorySaveErr, paymenthistorySaveRes) {
            // Handle Paymenthistory save error
            if (paymenthistorySaveErr) {
              return done(paymenthistorySaveErr);
            }

            // Get a list of Paymenthistories
            agent.get('/api/paymenthistories')
              .end(function (paymenthistorysGetErr, paymenthistorysGetRes) {
                // Handle Paymenthistory save error
                if (paymenthistorysGetErr) {
                  return done(paymenthistorysGetErr);
                }

                // Get Paymenthistories list
                var paymenthistories = paymenthistoriesGetRes.body;

                // Set assertions
                (paymenthistories[0].user._id).should.equal(userId);
                (paymenthistories[0].name).should.match('Paymenthistory name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Paymenthistory if not logged in', function (done) {
    agent.post('/api/paymenthistories')
      .send(paymenthistory)
      .expect(403)
      .end(function (paymenthistorySaveErr, paymenthistorySaveRes) {
        // Call the assertion callback
        done(paymenthistorySaveErr);
      });
  });

  it('should not be able to save an Paymenthistory if no name is provided', function (done) {
    // Invalidate name field
    paymenthistory.name = '';

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

        // Save a new Paymenthistory
        agent.post('/api/paymenthistories')
          .send(paymenthistory)
          .expect(400)
          .end(function (paymenthistorySaveErr, paymenthistorySaveRes) {
            // Set message assertion
            (paymenthistorySaveRes.body.message).should.match('Please fill Paymenthistory name');

            // Handle Paymenthistory save error
            done(paymenthistorySaveErr);
          });
      });
  });

  it('should be able to update an Paymenthistory if signed in', function (done) {
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

        // Save a new Paymenthistory
        agent.post('/api/paymenthistories')
          .send(paymenthistory)
          .expect(200)
          .end(function (paymenthistorySaveErr, paymenthistorySaveRes) {
            // Handle Paymenthistory save error
            if (paymenthistorySaveErr) {
              return done(paymenthistorySaveErr);
            }

            // Update Paymenthistory name
            paymenthistory.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Paymenthistory
            agent.put('/api/paymenthistories/' + paymenthistorySaveRes.body._id)
              .send(paymenthistory)
              .expect(200)
              .end(function (paymenthistoryUpdateErr, paymenthistoryUpdateRes) {
                // Handle Paymenthistory update error
                if (paymenthistoryUpdateErr) {
                  return done(paymenthistoryUpdateErr);
                }

                // Set assertions
                (paymenthistoryUpdateRes.body._id).should.equal(paymenthistorySaveRes.body._id);
                (paymenthistoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Paymenthistories if not signed in', function (done) {
    // Create new Paymenthistory model instance
    var paymenthistoryObj = new Paymenthistory(paymenthistory);

    // Save the paymenthistory
    paymenthistoryObj.save(function () {
      // Request Paymenthistories
      request(app).get('/api/paymenthistories')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Paymenthistory if not signed in', function (done) {
    // Create new Paymenthistory model instance
    var paymenthistoryObj = new Paymenthistory(paymenthistory);

    // Save the Paymenthistory
    paymenthistoryObj.save(function () {
      request(app).get('/api/paymenthistories/' + paymenthistoryObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', paymenthistory.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Paymenthistory with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/paymenthistories/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Paymenthistory is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Paymenthistory which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Paymenthistory
    request(app).get('/api/paymenthistories/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Paymenthistory with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Paymenthistory if signed in', function (done) {
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

        // Save a new Paymenthistory
        agent.post('/api/paymenthistories')
          .send(paymenthistory)
          .expect(200)
          .end(function (paymenthistorySaveErr, paymenthistorySaveRes) {
            // Handle Paymenthistory save error
            if (paymenthistorySaveErr) {
              return done(paymenthistorySaveErr);
            }

            // Delete an existing Paymenthistory
            agent.delete('/api/paymenthistories/' + paymenthistorySaveRes.body._id)
              .send(paymenthistory)
              .expect(200)
              .end(function (paymenthistoryDeleteErr, paymenthistoryDeleteRes) {
                // Handle paymenthistory error error
                if (paymenthistoryDeleteErr) {
                  return done(paymenthistoryDeleteErr);
                }

                // Set assertions
                (paymenthistoryDeleteRes.body._id).should.equal(paymenthistorySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Paymenthistory if not signed in', function (done) {
    // Set Paymenthistory user
    paymenthistory.user = user;

    // Create new Paymenthistory model instance
    var paymenthistoryObj = new Paymenthistory(paymenthistory);

    // Save the Paymenthistory
    paymenthistoryObj.save(function () {
      // Try deleting Paymenthistory
      request(app).delete('/api/paymenthistories/' + paymenthistoryObj._id)
        .expect(403)
        .end(function (paymenthistoryDeleteErr, paymenthistoryDeleteRes) {
          // Set message assertion
          (paymenthistoryDeleteRes.body.message).should.match('User is not authorized');

          // Handle Paymenthistory error error
          done(paymenthistoryDeleteErr);
        });

    });
  });

  it('should be able to get a single Paymenthistory that has an orphaned user reference', function (done) {
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

          // Save a new Paymenthistory
          agent.post('/api/paymenthistories')
            .send(paymenthistory)
            .expect(200)
            .end(function (paymenthistorySaveErr, paymenthistorySaveRes) {
              // Handle Paymenthistory save error
              if (paymenthistorySaveErr) {
                return done(paymenthistorySaveErr);
              }

              // Set assertions on new Paymenthistory
              (paymenthistorySaveRes.body.name).should.equal(paymenthistory.name);
              should.exist(paymenthistorySaveRes.body.user);
              should.equal(paymenthistorySaveRes.body.user._id, orphanId);

              // force the Paymenthistory to have an orphaned user reference
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

                    // Get the Paymenthistory
                    agent.get('/api/paymenthistories/' + paymenthistorySaveRes.body._id)
                      .expect(200)
                      .end(function (paymenthistoryInfoErr, paymenthistoryInfoRes) {
                        // Handle Paymenthistory error
                        if (paymenthistoryInfoErr) {
                          return done(paymenthistoryInfoErr);
                        }

                        // Set assertions
                        (paymenthistoryInfoRes.body._id).should.equal(paymenthistorySaveRes.body._id);
                        (paymenthistoryInfoRes.body.name).should.equal(paymenthistory.name);
                        should.equal(paymenthistoryInfoRes.body.user, undefined);

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
      Paymenthistory.remove().exec(done);
    });
  });
});
