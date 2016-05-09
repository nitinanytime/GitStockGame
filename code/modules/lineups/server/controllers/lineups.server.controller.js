'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lineup = mongoose.model('Lineup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Lineup
 */
exports.create = function(req, res) {
  var lineup = new Lineup(req.body);
  lineup.user = req.user;

  lineup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lineup);
    }
  });
};

/**
 * Show the current Lineup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var lineup = req.lineup ? req.lineup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  lineup.isCurrentUserOwner = req.user && lineup.user && lineup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(lineup);
};

/**
 * Update a Lineup
 */
exports.update = function(req, res) {
  var lineup = req.lineup ;

  lineup = _.extend(lineup , req.body);

  lineup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lineup);
    }
  });
};

/**
 * Delete an Lineup
 */
exports.delete = function(req, res) {
  var lineup = req.lineup ;

  lineup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lineup);
    }
  });
};

/**
 * List of Lineups
 */
exports.list = function(req, res) { 
  Lineup.find(req.query).sort('-created').populate('user', 'displayName').populate('line.stock').exec(function(err, lineups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(lineups);
    }
  });
};

/**
 * Lineup middleware
 */
exports.lineupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Lineup is invalid'
    });
  }

  Lineup.findById(id).populate('user', 'displayName').populate('line.stock').exec(function (err, lineup) {
    if (err) {
      return next(err);
    } else if (!lineup) {
      return res.status(404).send({
        message: 'No Lineup with that identifier has been found'
      });
    }
    req.lineup = lineup;
    next();
  });
};
