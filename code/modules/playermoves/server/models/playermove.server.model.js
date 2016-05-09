'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Playermove Schema
 */
var PlayermoveSchema = new Schema({
  
  stock_price: {
    type: Number,
    default: '',
    required: 'Please fill Playermove stock_price',
    trim: true
  },
  stock_unit: {
    type: Number,
    default: '',
    required: 'Please fill Playermove Stock unit',
    trim: true
  },
  type: {
    type: String,
    default: '',
    required: 'Please fill Playermove type',
    trim: true
  },
  total_money: {
    type: Number,
    default: '',
    required: 'Please fill Playermove total_money',
    trim: true
  },
  checked: {
    type: Boolean,
    default: false,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  stock: {
    type: Schema.ObjectId,
    ref: 'Stock'
  },
  player: {
    type: Schema.ObjectId,
    ref: 'Player'
  }
});

mongoose.model('Playermove', PlayermoveSchema);
