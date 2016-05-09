'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Lineup Schema
 */
var LineupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill LineUp name',
    trim: true
  },
  line: [{
    stock_unit: Number,
    stock : {
            type: Schema.ObjectId,
            ref: 'Stock'
        },
    checked: {
            type: Boolean,
            default: false
        }
    // any other paths for features
  }],
  total_money: {
    type: Number,
    default: 0,
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

mongoose.model('Lineup', LineupSchema);
