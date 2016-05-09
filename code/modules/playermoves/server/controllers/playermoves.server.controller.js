'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Playermove = mongoose.model('Playermove'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Playermove
 */
exports.create = function(req, res) {
  var playermove = new Playermove(req.body);
  playermove.user = req.user;

  playermove.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playermove);
    }
  });
};

/**
 * Show the current Playermove
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var playermove = req.playermove ? req.playermove.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  playermove.isCurrentUserOwner = req.user && playermove.user && playermove.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(playermove);
};

/**
 * Update a Playermove
 */
exports.update = function(req, res) {
  var playermove = req.playermove ;

  playermove = _.extend(playermove , req.body);

  playermove.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playermove);
    }
  });
};

/**
 * Delete an Playermove
 */
exports.delete = function(req, res) {
  var playermove = req.playermove ;

  playermove.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playermove);
    }
  });
};

/**
 * List of Playermoves
 */
exports.list = function(req, res) { 
  Playermove.find(req.query).sort('-created').populate('player', 'player_username').populate('stock').exec(function(err, playermoves) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(playermoves);
    }
  });
};

/**
 * Playermove middleware
 */
exports.playermoveByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Playermove is invalid'
    });
  }

  Playermove.findById(id).populate('user', 'displayName').exec(function (err, playermove) {
    if (err) {
      return next(err);
    } else if (!playermove) {
      return res.status(404).send({
        message: 'No Playermove with that identifier has been found'
      });
    }
    req.playermove = playermove;
    next();
  });
};
