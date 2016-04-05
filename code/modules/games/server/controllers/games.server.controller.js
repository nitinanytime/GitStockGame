'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Game = mongoose.model('Game'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Game
 */
exports.create = function(req, res) {
  var game = new Game(req.body);
  game.user = req.user;

  game.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(game);
    }
  });
};

/**
 * Show the current Game
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var game = req.game ? req.game.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  game.isCurrentUserOwner = req.user && game.user && game.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(game);
};

/**
 * Update a Game
 */
exports.update = function(req, res) {
  var game = req.game ;

  game = _.extend(game , req.body);

  game.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(game);
    }
  });
};

/**
 * Delete an Game
 */
exports.delete = function(req, res) {
  var game = req.game ;

  game.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(game);
    }
  });
};

/**
 * List of Games
 */
exports.list = function(req, res) { 
  Game.find().sort('-created').populate('user', 'displayName').exec(function(err, games) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(games);
    }
  });
};

/**
 * Game middleware
 */
exports.gameByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Game is invalid'
    });
  }

  Game.findById(id).populate('user', 'displayName').exec(function (err, game) {
    if (err) {
      return next(err);
    } else if (!game) {
      return res.status(404).send({
        message: 'No Game with that identifier has been found'
      });
    }
    req.game = game;
    next();
  });
};
