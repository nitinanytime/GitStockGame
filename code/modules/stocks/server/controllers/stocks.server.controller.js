'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Stock = mongoose.model('Stock'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Stock
 */
exports.create = function(req, res) {
  var stock = new Stock(req.body);
  stock.user = req.user;

  stock.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

/**
 * Show the current Stock
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var stock = req.stock ? req.stock.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  stock.isCurrentUserOwner = req.user && stock.user && stock.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(stock);
};

/**
 * Update a Stock
 */
exports.update = function(req, res) {
  var stock = req.stock ;

  stock = _.extend(stock , req.body);

  stock.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

/**
 * Delete an Stock
 */
exports.delete = function(req, res) {
  var stock = req.stock ;

  stock.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

/**
 * List of Stocks
 */
exports.list = function(req, res) { 
  Stock.find().sort('-created').populate('user', 'displayName').exec(function(err, stocks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stocks);
    }
  });
};

/**
 * Stock middleware
 */
exports.stockByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Stock is invalid'
    });
  }

  Stock.findById(id).populate('user', 'displayName').exec(function (err, stock) {
    if (err) {
      return next(err);
    } else if (!stock) {
      return res.status(404).send({
        message: 'No Stock with that identifier has been found'
      });
    }
    req.stock = stock;
    next();
  });
};
