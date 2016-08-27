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
    trim: true
  },
  game_type: {
    type: String,
    default: '',
    required: 'Please fill game_type',
    trim: true
  },
  game_inviteList: [String],
  game_status: {
    type: String,
    default: 'Open',
    required: 'Please fill game_type',
    trim: true
  },
  winningArray: [{
    playername: String,
    player: Schema.ObjectId,
    totalStock: Number,
    totalMoney: Number,
    winingAmount: Number
    // any other paths for features
  }],
  game_startTime: {
    type: Date,
    required: 'Please fill  game_startTime',
    trim: true
  },
  game_endTime: {
    type: Date,
    required: 'Please fill game_endTime',
    trim: true
  },
  game_maxPlayer: {
    type: Number,
    default: 1000,
    required: 'Please fill game_maxPlayer',
    trim: true
  },
  game_minPlayer: {
    type: Number,
    default: 2,
    required: 'Please fill game_maxPlayer',
    trim: true
  },
  game_player: {
    type: Number,
    default: 0,
    required: 'Please fill game_player',
    trim: true
  },
  game_money: {
    type: Number,
    default: 1000000,
    required: 'Please fill game_money',
    trim: true
  },
  game_EntryFee: {
    type: Number,
    default: '',
    required: 'Please fill game_EntryFee',
    trim: true
  },
  game_EntryMoney: {
    type: Number,
    default: 0,
    required: 'Please fill game_EntryMoney',
    trim: true
  },
  game_prize: {
    type: Number,
    default: 0,
    required: 'Please fill game_prize',
    trim: true
  },
  game_winningRule: {
    key: String,
    value_1: Number, //size
    value_2: Number  //commission
  },
  game_payOut: [{
    min: Number,
    max: Number,
    money: Number
  }],
  game_description: {
    type: String,
    default: null,
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
