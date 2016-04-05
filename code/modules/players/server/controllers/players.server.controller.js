'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Player = mongoose.model('Player'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Player
 */
exports.create = function(req, res) {
  var player = new Player(req.body);
  player.user = req.user;

  player.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(player);
    }
  });
};

/**
 * Show the current Player
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var player = req.player ? req.player.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  player.isCurrentUserOwner = req.user && player.user && player.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(player);
};

/**
 * Update a Player
 */
exports.update = function(req, res) {
  var player = req.player ;

  player = _.extend(player , req.body);

  player.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(player);
    }
  });
};

/**
 * Delete an Player
 */
exports.delete = function(req, res) {
  var player = req.player ;

  player.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(player);
    }
  });
};

/**
 * List of Players
 */
exports.list = function(req, res) { 
  //console.log("yes this is request parameter");
  console.log(req.query);
  Player.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, players) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(players);
    }
  });
};

/**
 * Player middleware
 */
exports.playerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Player is invalid'
    });
  }

  Player.findById(id).populate('user', 'displayName').exec(function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return res.status(404).send({
        message: 'No Player with that identifier has been found'
      });
    }
    req.player = player;
    next();
  });
};
