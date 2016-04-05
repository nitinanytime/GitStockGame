'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Stock = mongoose.model('Stock'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, stock;

/**
 * Stock routes tests
 */
describe('Stock CRUD tests', function () {

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

    // Save a user to the test db and create new Stock
    user.save(function () {
      stock = {
        name: 'Stock name'
      };

      done();
    });
  });

  it('should be able to save a Stock if logged in', function (done) {
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

        // Save a new Stock
        agent.post('/api/stocks')
          .send(stock)
          .expect(200)
          .end(function (stockSaveErr, stockSaveRes) {
            // Handle Stock save error
            if (stockSaveErr) {
              return done(stockSaveErr);
            }

            // Get a list of Stocks
            agent.get('/api/stocks')
              .end(function (stocksGetErr, stocksGetRes) {
                // Handle Stock save error
                if (stocksGetErr) {
                  return done(stocksGetErr);
                }

                // Get Stocks list
                var stocks = stocksGetRes.body;

                // Set assertions
                (stocks[0].user._id).should.equal(userId);
                (stocks[0].name).should.match('Stock name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Stock if not logged in', function (done) {
    agent.post('/api/stocks')
      .send(stock)
      .expect(403)
      .end(function (stockSaveErr, stockSaveRes) {
        // Call the assertion callback
        done(stockSaveErr);
      });
  });

  it('should not be able to save an Stock if no name is provided', function (done) {
    // Invalidate name field
    stock.name = '';

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

        // Save a new Stock
        agent.post('/api/stocks')
          .send(stock)
          .expect(400)
          .end(function (stockSaveErr, stockSaveRes) {
            // Set message assertion
            (stockSaveRes.body.message).should.match('Please fill Stock name');

            // Handle Stock save error
            done(stockSaveErr);
          });
      });
  });

  it('should be able to update an Stock if signed in', function (done) {
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

        // Save a new Stock
        agent.post('/api/stocks')
          .send(stock)
          .expect(200)
          .end(function (stockSaveErr, stockSaveRes) {
            // Handle Stock save error
            if (stockSaveErr) {
              return done(stockSaveErr);
            }

            // Update Stock name
            stock.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Stock
            agent.put('/api/stocks/' + stockSaveRes.body._id)
              .send(stock)
              .expect(200)
              .end(function (stockUpdateErr, stockUpdateRes) {
                // Handle Stock update error
                if (stockUpdateErr) {
                  return done(stockUpdateErr);
                }

                // Set assertions
                (stockUpdateRes.body._id).should.equal(stockSaveRes.body._id);
                (stockUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Stocks if not signed in', function (done) {
    // Create new Stock model instance
    var stockObj = new Stock(stock);

    // Save the stock
    stockObj.save(function () {
      // Request Stocks
      request(app).get('/api/stocks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Stock if not signed in', function (done) {
    // Create new Stock model instance
    var stockObj = new Stock(stock);

    // Save the Stock
    stockObj.save(function () {
      request(app).get('/api/stocks/' + stockObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', stock.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Stock with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/stocks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Stock is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Stock which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Stock
    request(app).get('/api/stocks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Stock with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Stock if signed in', function (done) {
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

        // Save a new Stock
        agent.post('/api/stocks')
          .send(stock)
          .expect(200)
          .end(function (stockSaveErr, stockSaveRes) {
            // Handle Stock save error
            if (stockSaveErr) {
              return done(stockSaveErr);
            }

            // Delete an existing Stock
            agent.delete('/api/stocks/' + stockSaveRes.body._id)
              .send(stock)
              .expect(200)
              .end(function (stockDeleteErr, stockDeleteRes) {
                // Handle stock error error
                if (stockDeleteErr) {
                  return done(stockDeleteErr);
                }

                // Set assertions
                (stockDeleteRes.body._id).should.equal(stockSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Stock if not signed in', function (done) {
    // Set Stock user
    stock.user = user;

    // Create new Stock model instance
    var stockObj = new Stock(stock);

    // Save the Stock
    stockObj.save(function () {
      // Try deleting Stock
      request(app).delete('/api/stocks/' + stockObj._id)
        .expect(403)
        .end(function (stockDeleteErr, stockDeleteRes) {
          // Set message assertion
          (stockDeleteRes.body.message).should.match('User is not authorized');

          // Handle Stock error error
          done(stockDeleteErr);
        });

    });
  });

  it('should be able to get a single Stock that has an orphaned user reference', function (done) {
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

          // Save a new Stock
          agent.post('/api/stocks')
            .send(stock)
            .expect(200)
            .end(function (stockSaveErr, stockSaveRes) {
              // Handle Stock save error
              if (stockSaveErr) {
                return done(stockSaveErr);
              }

              // Set assertions on new Stock
              (stockSaveRes.body.name).should.equal(stock.name);
              should.exist(stockSaveRes.body.user);
              should.equal(stockSaveRes.body.user._id, orphanId);

              // force the Stock to have an orphaned user reference
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

                    // Get the Stock
                    agent.get('/api/stocks/' + stockSaveRes.body._id)
                      .expect(200)
                      .end(function (stockInfoErr, stockInfoRes) {
                        // Handle Stock error
                        if (stockInfoErr) {
                          return done(stockInfoErr);
                        }

                        // Set assertions
                        (stockInfoRes.body._id).should.equal(stockSaveRes.body._id);
                        (stockInfoRes.body.name).should.equal(stock.name);
                        should.equal(stockInfoRes.body.user, undefined);

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
      Stock.remove().exec(done);
    });
  });
});
