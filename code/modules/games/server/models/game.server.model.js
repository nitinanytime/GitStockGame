'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Schema
 */
var GameSchema = new Schema({
  game_name: {
    type: String,
    default: '',
    required: 'Please fill Game name',
    trim: true
  },
  game_type: {
    type: String,
    default: '',
    required: 'Please fill game_type',
    trim: true
  },
  game_startTime: {
    type: Date,
    default: Date.now,
    required: 'Please fill  game_startTime',
    trim: true
  },
  game_endTime: {
    type: Date,
    default: '',
    required: 'Please fill game_endTime',
    trim: true
  },
  game_maxPlayer: {
    type: Number,
    default: '',
    required: 'Please fill game_maxPlayer',
    trim: true
  },
  game_player: {
    type: Number,
    default: '',
    required: 'Please fill game_player',
    trim: true
  },
  game_money: {
    type: Number,
    default: '',
    required: 'Please fill game_money',
    trim: true
  },
  game_maxMoney: {
    type: Number,
    default: '',
    required: 'Please fill game_maxMoney',
    trim: true
  },
  game_minMoney: {
    type: Number,
    default: '',
    required: 'Please fill game_minMoney',
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

mongoose.model('Game', GameSchema);
