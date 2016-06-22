'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Notification = mongoose.model('Notification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Notification
 */
exports.create = function(req, res) {
  var notification = new Notification(req.body);
  notification.user = req.user;

  notification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var notification = req.notification ? req.notification.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  notification.isCurrentUserOwner = req.user && notification.user && notification.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(notification);
};

/**
 * Update a Notification
 */
exports.update = function(req, res) {
  var notification = req.notification ;

  notification = _.extend(notification , req.body);

  notification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};

/**
 * Delete an Notification
 */
exports.delete = function(req, res) {
  var notification = req.notification ;

  notification.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};

/**
 * List of Notifications
 */
exports.list = function(req, res) { 

  Notification.find({user:req.user._id}).sort('-created').populate('user', 'displayName').exec(function(err, notifications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notifications);
    }
  });
};

/**
 * Notification middleware
 */
exports.notificationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Notification is invalid'
    });
  }

  Notification.findById(id).populate('user', 'displayName').exec(function (err, notification) {
    if (err) {
      return next(err);
    } else if (!notification) {
      return res.status(404).send({
        message: 'No Notification with that identifier has been found'
      });
    }
    req.notification = notification;
    next();
  });
};

/**
 * Create a Notification
 */
exports.sendNotification = function(notifyObject) {
  var notification = new Notification(notifyObject);
  notification.user = notifyObject.user;

  notification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("Successfully Notification send");
    }
  });
};
