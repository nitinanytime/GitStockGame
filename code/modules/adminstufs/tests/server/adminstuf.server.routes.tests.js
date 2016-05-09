'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adminstuf = mongoose.model('Adminstuf'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, adminstuf;

/**
 * Adminstuf routes tests
 */
describe('Adminstuf CRUD tests', function () {

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

    // Save a user to the test db and create new Adminstuf
    user.save(function () {
      adminstuf = {
        name: 'Adminstuf name'
      };

      done();
    });
  });

  it('should be able to save a Adminstuf if logged in', function (done) {
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

        // Save a new Adminstuf
        agent.post('/api/adminstufs')
          .send(adminstuf)
          .expect(200)
          .end(function (adminstufSaveErr, adminstufSaveRes) {
            // Handle Adminstuf save error
            if (adminstufSaveErr) {
              return done(adminstufSaveErr);
            }

            // Get a list of Adminstufs
            agent.get('/api/adminstufs')
              .end(function (adminstufsGetErr, adminstufsGetRes) {
                // Handle Adminstuf save error
                if (adminstufsGetErr) {
                  return done(adminstufsGetErr);
                }

                // Get Adminstufs list
                var adminstufs = adminstufsGetRes.body;

                // Set assertions
                (adminstufs[0].user._id).should.equal(userId);
                (adminstufs[0].name).should.match('Adminstuf name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adminstuf if not logged in', function (done) {
    agent.post('/api/adminstufs')
      .send(adminstuf)
      .expect(403)
      .end(function (adminstufSaveErr, adminstufSaveRes) {
        // Call the assertion callback
        done(adminstufSaveErr);
      });
  });

  it('should not be able to save an Adminstuf if no name is provided', function (done) {
    // Invalidate name field
    adminstuf.name = '';

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

        // Save a new Adminstuf
        agent.post('/api/adminstufs')
          .send(adminstuf)
          .expect(400)
          .end(function (adminstufSaveErr, adminstufSaveRes) {
            // Set message assertion
            (adminstufSaveRes.body.message).should.match('Please fill Adminstuf name');

            // Handle Adminstuf save error
            done(adminstufSaveErr);
          });
      });
  });

  it('should be able to update an Adminstuf if signed in', function (done) {
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

        // Save a new Adminstuf
        agent.post('/api/adminstufs')
          .send(adminstuf)
          .expect(200)
          .end(function (adminstufSaveErr, adminstufSaveRes) {
            // Handle Adminstuf save error
            if (adminstufSaveErr) {
              return done(adminstufSaveErr);
            }

            // Update Adminstuf name
            adminstuf.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adminstuf
            agent.put('/api/adminstufs/' + adminstufSaveRes.body._id)
              .send(adminstuf)
              .expect(200)
              .end(function (adminstufUpdateErr, adminstufUpdateRes) {
                // Handle Adminstuf update error
                if (adminstufUpdateErr) {
                  return done(adminstufUpdateErr);
                }

                // Set assertions
                (adminstufUpdateRes.body._id).should.equal(adminstufSaveRes.body._id);
                (adminstufUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adminstufs if not signed in', function (done) {
    // Create new Adminstuf model instance
    var adminstufObj = new Adminstuf(adminstuf);

    // Save the adminstuf
    adminstufObj.save(function () {
      // Request Adminstufs
      request(app).get('/api/adminstufs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adminstuf if not signed in', function (done) {
    // Create new Adminstuf model instance
    var adminstufObj = new Adminstuf(adminstuf);

    // Save the Adminstuf
    adminstufObj.save(function () {
      request(app).get('/api/adminstufs/' + adminstufObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', adminstuf.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adminstuf with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adminstufs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adminstuf is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adminstuf which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adminstuf
    request(app).get('/api/adminstufs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adminstuf with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adminstuf if signed in', function (done) {
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

        // Save a new Adminstuf
        agent.post('/api/adminstufs')
          .send(adminstuf)
          .expect(200)
          .end(function (adminstufSaveErr, adminstufSaveRes) {
            // Handle Adminstuf save error
            if (adminstufSaveErr) {
              return done(adminstufSaveErr);
            }

            // Delete an existing Adminstuf
            agent.delete('/api/adminstufs/' + adminstufSaveRes.body._id)
              .send(adminstuf)
              .expect(200)
              .end(function (adminstufDeleteErr, adminstufDeleteRes) {
                // Handle adminstuf error error
                if (adminstufDeleteErr) {
                  return done(adminstufDeleteErr);
                }

                // Set assertions
                (adminstufDeleteRes.body._id).should.equal(adminstufSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adminstuf if not signed in', function (done) {
    // Set Adminstuf user
    adminstuf.user = user;

    // Create new Adminstuf model instance
    var adminstufObj = new Adminstuf(adminstuf);

    // Save the Adminstuf
    adminstufObj.save(function () {
      // Try deleting Adminstuf
      request(app).delete('/api/adminstufs/' + adminstufObj._id)
        .expect(403)
        .end(function (adminstufDeleteErr, adminstufDeleteRes) {
          // Set message assertion
          (adminstufDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adminstuf error error
          done(adminstufDeleteErr);
        });

    });
  });

  it('should be able to get a single Adminstuf that has an orphaned user reference', function (done) {
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

          // Save a new Adminstuf
          agent.post('/api/adminstufs')
            .send(adminstuf)
            .expect(200)
            .end(function (adminstufSaveErr, adminstufSaveRes) {
              // Handle Adminstuf save error
              if (adminstufSaveErr) {
                return done(adminstufSaveErr);
              }

              // Set assertions on new Adminstuf
              (adminstufSaveRes.body.name).should.equal(adminstuf.name);
              should.exist(adminstufSaveRes.body.user);
              should.equal(adminstufSaveRes.body.user._id, orphanId);

              // force the Adminstuf to have an orphaned user reference
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

                    // Get the Adminstuf
                    agent.get('/api/adminstufs/' + adminstufSaveRes.body._id)
                      .expect(200)
                      .end(function (adminstufInfoErr, adminstufInfoRes) {
                        // Handle Adminstuf error
                        if (adminstufInfoErr) {
                          return done(adminstufInfoErr);
                        }

                        // Set assertions
                        (adminstufInfoRes.body._id).should.equal(adminstufSaveRes.body._id);
                        (adminstufInfoRes.body.name).should.equal(adminstuf.name);
                        should.equal(adminstufInfoRes.body.user, undefined);

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
      Adminstuf.remove().exec(done);
    });
  });
});
