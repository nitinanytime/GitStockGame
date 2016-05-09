'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adminstuf = mongoose.model('Adminstuf'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adminstuf
 */
exports.create = function(req, res) {
  var adminstuf = new Adminstuf(req.body);
  adminstuf.user = req.user;

  adminstuf.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminstuf);
    }
  });
};

/**
 * Show the current Adminstuf
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adminstuf = req.adminstuf ? req.adminstuf.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adminstuf.isCurrentUserOwner = req.user && adminstuf.user && adminstuf.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(adminstuf);
};

/**
 * Update a Adminstuf
 */
exports.update = function(req, res) {
  var adminstuf = req.adminstuf ;

  adminstuf = _.extend(adminstuf , req.body);

  adminstuf.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminstuf);
    }
  });
};

/**
 * Delete an Adminstuf
 */
exports.delete = function(req, res) {
  var adminstuf = req.adminstuf ;

  adminstuf.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminstuf);
    }
  });
};

/**
 * List of Adminstufs
 */
exports.list = function(req, res) { 
  Adminstuf.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, adminstufs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminstufs);
    }
  });
};

/**
 * Adminstuf middleware
 */
exports.adminstufByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adminstuf is invalid'
    });
  }

  Adminstuf.findById(id).populate('user', 'displayName').exec(function (err, adminstuf) {
    if (err) {
      return next(err);
    } else if (!adminstuf) {
      return res.status(404).send({
        message: 'No Adminstuf with that identifier has been found'
      });
    }
    req.adminstuf = adminstuf;
    next();
  });
};
