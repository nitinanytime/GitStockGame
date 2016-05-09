'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Paymenthistory Schema
 */
var PaymenthistorySchema = new Schema({
  
 transactionId: {
    type: String,
    default: null,
    trim: true
  },
  amount: {
    type: Number,
    default: '',
    required: 'Please fill amount',
    trim: true
  },
  payment_method: {
    type: String,
    default: '',
    required: 'Please fill payment_method',
    trim: true
  },
  type: {
    type: String,
    default: null,
    trim: true
  },
  status: {
    type: String,
    default: 'Requested',
    required: 'Please fill Tansffer type',
    trim: true
  },
  after_balnace: {
    type: Number,
    default: null,
    trim: true
  },
  description: {
    type: String,
    default: null,
    trim: true
  },
  paypalId: {
    type: String,
    default: null,
    trim: true
  },
  username: {
    type: String,
    default: null,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  game: {
    type: Schema.ObjectId,
    default: null,
    ref: 'Game'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Paymenthistory', PaymenthistorySchema);
