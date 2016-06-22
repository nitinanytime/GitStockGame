'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Stockhistory = mongoose.model('Stockhistory'),
  Stock = mongoose.model('Stock'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');



var cron = require('node-schedule');

var http = require('http');

/**
 * Create a Stockhistory
 */
exports.create = function(req, res) {
  var stockhistory = new Stockhistory(req.body);
  stockhistory.user = req.user;

  stockhistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockhistory);
    }
  });
};

/**
 * Show the current Stockhistory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var stockhistory = req.stockhistory ? req.stockhistory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  stockhistory.isCurrentUserOwner = req.user && stockhistory.user && stockhistory.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(stockhistory);
};

/**
 * Update a Stockhistory
 */
exports.update = function(req, res) {
  var stockhistory = req.stockhistory ;

  stockhistory = _.extend(stockhistory , req.body);

  stockhistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockhistory);
    }
  });
};

/**
 * Delete an Stockhistory
 */
exports.delete = function(req, res) {
  var stockhistory = req.stockhistory ;

  stockhistory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockhistory);
    }
  });
};

/**
 * List of Stockhistories
 */
exports.list = function(req, res) { 

  if(req.query.created)
    {
        req.query.created = new Date(req.query.created);
    }else{
        
    }

    console.log(req.query.created + new Date(req.query.created).setDate(req.query.created.getDate()+1));
  Stockhistory.find(
  {created: {
        $gte: req.query.created,
        $lte: new Date(req.query.created).setDate(req.query.created.getDate()+1)
      }}
    ).sort('-created').populate('user', 'displayName').exec(function(err, stockhistories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stockhistories);
    }
  });
};

/**
 * Stockhistory middleware
 */
exports.stockhistoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Stockhistory is invalid'
    });
  }

  Stockhistory.findById(id).populate('user', 'displayName').exec(function (err, stockhistory) {
    if (err) {
      return next(err);
    } else if (!stockhistory) {
      return res.status(404).send({
        message: 'No Stockhistory with that identifier has been found'
      });
    }
    req.stockhistory = stockhistory;
    next();
  });
};


/* run the job at 18:55:30 on Dec. 14 2018*/
var rule = new cron.RecurrenceRule();
rule.hour = 9;
//rule.minute = 40;
cron.scheduleJob(rule, function(){
//    createStock();
    getStockList();
});



/* run the job at 18:55:30 on Dec. 14 2018*/
//var rule = new cron.RecurrenceRule();
//rule.minutes = 20;
//rule.minute = 55;
//cron.scheduleJob(rule, function(){
//    createStock();
//    getStockList();
//});



function getStockList(){
  Stock.find().sort('-created').exec(function(err, stocks) {
    if (err) {
      return null;
    } else {
      
      updateStock(stocks);
    }
  });
}


function updateStock(stocks){

//console.log(stocks.length);

//console.log(stocks[237]);

for(var j = 0; j < stocks.length; j++){
  //console.log('loop First' + j);
  var stockRequest = "";
  for(var k = 0; k < 50; k++){
    //console.log('loop Second' + k);
    
      stockRequest = stockRequest + ',' + stocks[j].Symbol;
    
    
    j++;
    //console.log('loop Second 2nd' + j);
    if(j>stocks.length-1){break;}
  }
  sleep(5000);
//console.log('loop End' + j);

//console.log(stockRequest);

updateTheseStock(stockRequest);
}
console.log("stock updated Successfully");
};


function updateTheseStock(stockRequest){
  var optionsget = {
    host : 'finance.yahoo.com',
    path : '/webservice/v1/symbols/'+stockRequest+'/quote?format=json&view=detail', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

http.get(optionsget,
  function (res) {

    var data = '';
    // parsed response body as js object 
    res.on('data', function (chunk) {
    //console.log('BODY: ' + chunk);
    data += chunk;

  });
    res.on('end', function() {

    //console.log(JSON.parse(data));

    var stockList = [];

    try{
        data = JSON.parse(data);
        stockList = data.list.resources;
    }catch(e){
        console.log(e.message); //error in the above string(in this case,yes)!
    }
    
    console.log("total stock updated"+ stockList.length);


    for(var i = 0; i < stockList.length; i++){
      var element = stockList[i].resource.fields;
        var stockhistory = new Stockhistory();
        stockhistory.Symbol = element.symbol;
        stockhistory.Name = element.name;
        //stock.Market = stockList[i].symbol;
        //stock.MostLiquidExchange = stockList[i].symbol;
        //stock.CategoryOrIndustry = stockList[i].symbol;
        //stock.Open = stockList[i].symbol;
        //stock.Close = stockList[i].symbol;
        stockhistory.High = element.day_high;
        stockhistory.Low = element.day_low;
        stockhistory.Last = element.price;
        //stock.LastSize = stockList[i].symbol;
        stockhistory.Volume = element.volume;
        //stock.PreviousClose = stockList[i].symbol;

        stockhistory.ChangeFromPreviousClose = element.change;
        stockhistory.PercentChangeFromPreviousClose = element.chg_percent;
        stockhistory.High52Weeks = element.year_high;
        stockhistory.Low52Weeks = element.year_low;
        //stock.Currency = stockList[i].symbol;
        //stock.TradingHalted = stockList[i].symbol;
        stockhistory.Time = element.utctime;

        //console.log(stock);

        stockhistory.save(function(err) {
          if (err) {
              console.log( "message:" + errorHandler.getErrorMessage(err));
          } else {
              console.log( "Stockhistory Done");
          }
      });

      }
    

  });

    // raw response 
    
  });
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}