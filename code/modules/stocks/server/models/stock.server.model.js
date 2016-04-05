'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Stock Schema
 */
var StockSchema = new Schema({
  Symbol: {
    type: String,
    default: '',
    required: 'Please fill Symbol',
    trim: true
  },
  Name: {
    type: String,
    default: '',
    required: 'Please fill Stock Name',
    trim: true
  },
  Market: {
    type: String,
    default: 'Market',
    required: 'Please fill Stock Market',
    trim: true
  },
  MostLiquidExchange: {
    type: Boolean,
    default: false,
    required: 'Please fill Stock Up Rate',
    trim: true
  },
  CategoryOrIndustry: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock down_rate',
    trim: true
  },
  Open: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock Open Rate',
    trim: true
  },
  Close: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock Close Rate',
    trim: true
  },
  High: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock High Rate',
    trim: true
  },
  Low: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock Last Rate',
    trim: true
  },
  Last: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock Open Rate',
    trim: true
  },
  LastSize: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock LastSize ',
    trim: true
  },
  Volume: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock Volume ',
    trim: true
  },
  PreviousClose: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock PreviousClose Rate',
    trim: true
  },
  PreviousCloseDate: {
    type: Date,
    default: Date.now,
    required: 'Please fill Stock PreviousCloseDate',
    trim: true
  },
  ChangeFromPreviousClose: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock ChangeFromPreviousClose',
    trim: true
  },
  PercentChangeFromPreviousClose: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock PercentChangeFromPreviousClose',
    trim: true
  },
  High52Weeks: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock High52Weeks Rate',
    trim: true
  },
  Low52Weeks: {
    type: Number,
    default: 0.0,
    required: 'Please fill Stock Low52Weeks Rate',
    trim: true
  },
  Currency: {
    type: String,
    default: 'USD',
    required: 'Please fill Stock Currency Rate',
    trim: true
  },
  TradingHalted: {
    type: Boolean,
    default: false,
    required: 'Please fill Stock TradingHalted or Not',
    trim: true
  },
  Date: {
    type: Date,
    default: Date.now,
    required: 'Please fill Stock Date',
    trim: true
  },
  Time: {
    type: Date,
    default: Date.now,
    required: 'Please fill Stock Time',
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

mongoose.model('Stock', StockSchema);
