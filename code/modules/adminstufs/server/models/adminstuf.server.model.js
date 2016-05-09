'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adminstuf Schema
 */
var AdminstufSchema = new Schema({
  type: {
    type: String,
    default: '',
    required: 'Please fill Adminstuf name',
    trim: true
  },
  key: {
    type: String,
    default: '',
    required: 'Please fill game_maxPlayer',
    trim: true
  },
  value_1: {
    type: String,
    default: 'Null',
    required: 'Please fill Stirng value_1',
    trim: true
  },
  value_2: {
    type: Number,
    default: 0,
    required: 'Please fill Number value_2',
    trim: true
  },
  active: {
    type: Boolean,
    default: false,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Adminstuf', AdminstufSchema);
