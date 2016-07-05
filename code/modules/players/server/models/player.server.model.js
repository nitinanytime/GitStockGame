'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Player Schema
 */
var PlayerSchema = new Schema({
  
  player_name: {
    type: String,
    default: '',
    required: 'Please fill player name',
    trim: true
  },
  player_username: {
    type: String,
    default: '',
    required: 'Please fill player name',
    trim: true
  },
  player_money: {
    type: Number,
    default: 0,
    required: 'Please fill player_money',
    trim: true
  },
  Player_rank: {
    type: Number,
    default: '2',
    required: 'Please fill Player_rank',
    trim: true
  },
  player_holdMoney: {
    type: Number,
    default: 1000000,
    required: 'Please fill player_holdMoney',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  game: {
    type: Schema.ObjectId,
    ref: 'Game'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Player', PlayerSchema);
