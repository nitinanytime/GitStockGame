'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Stock = mongoose.model('Stock'),
  Stockhistory = mongoose.model('Stockhistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var cron = require('node-schedule');

var http = require('http');

/**
 * Create a Stock
 */
exports.create = function(req, res) {
  var stock = new Stock(req.body);
  stock.user = req.user;

  stock.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

/**
 * Show the current Stock
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var stock = req.stock ? req.stock.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  stock.isCurrentUserOwner = req.user && stock.user && stock.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(stock);
};

/**
 * Update a Stock
 */
exports.update = function(req, res) {
  var stock = req.stock ;

  stock = _.extend(stock , req.body);

  stock.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

/**
 * Delete an Stock
 */
exports.delete = function(req, res) {
  var stock = req.stock ;

  stock.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stock);
    }
  });
};

/**
 * List of Stocks
 */
exports.list = function(req, res) {
  req.query.Last = {
                    $gte: 5
                  };
  Stock.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, stocks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(stocks);
    }
  });
};

/**
 * Stock middleware
 */
exports.stockByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Stock is invalid'
    });
  }

  Stock.findById(id).populate('user', 'displayName').exec(function (err, stock) {
    if (err) {
      return next(err);
    } else if (!stock) {
      return res.status(404).send({
        message: 'No Stock with that identifier has been found'
      });
    }
    req.stock = stock;
    next();
  });
};



/* run the job at 18:55:30 on Dec. 14 2018*/
var rule = new cron.RecurrenceRule();
rule.hour = 9;
rule.minute = 31;
cron.scheduleJob(rule, function(){
  console.log("Server Update imorning 9 AM");
    createStock();
    getStockList('Open');
});

/* run the job at 18:55:30 on Dec. 14 2018*/
var rule8 = new cron.RecurrenceRule();
rule8.hour = 16;
rule8.minute = 1;
cron.scheduleJob(rule8, function(){
  console.log("Server Update imorning 16 PM");
    createStock();
    getStockList('Close');
});

var minutes = 15, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("Server Update in 50 Minute");
  // do your stuff here
    createStock();
    getStockList('None');
}, the_interval);

//http://finance.yahoo.com/webservice/v1/symbols/RAD/quote?format=json&view=detail
/*I noted the changes , and scheduling next 2nd phase demo.
Date- 18-April

Include-
1. All the changes which we discuss on yesterday demo. flow should be like draft kings.
2. Xignite All API integration , get all the stocks , listing and update in each 5-10 mints.
3. Creation of Private game , and invite friends by mail.
4. mail SMTP setup and start use.
5. Scheduler for Stock API update, and winner calculation.

mean while i will give a video of status on 13th.

Yet to discuss-
1. User can create the lineup without signup or not?
2. what will be our action , if stock price will increase and total money will be min or max to the player fantasy money.
*/

function getStockList(type){
  Stock.find().sort('-created').exec(function(err, stocks) {
    if (err) {
      return null;
    } else {
      
      updateStock(stocks, type);
    }
  });
}


function updateStock(stocks, type){

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

updateTheseStock(stockRequest, type);
}
console.log("stock updated Successfully at "+ new Date());
};


function updateTheseStock(stockRequest, type){
  var optionsget = {
    host : 'finance.yahoo.com',
    headers: {'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; MotoE2(4G-LTE) Build/MPI24.65-39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.81 Mobile Safari/537.36'},
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
        //console.log(data);
        data = JSON.parse(data);
        stockList = data.list.resources;
    }catch(e){
      console.log("Error in Yahoo API Response +" + e);
       // console.log(e.message); //error in the above string(in this case,yes)!
    }
    
    console.log("total stock updated"+ stockList.length);


    for(var i = 0; i < stockList.length; i++){
      var element = stockList[i].resource.fields;
        var stock = {};
        stock.Symbol = element.symbol;
        stock.Name = element.name;
        //stock.Market = stockList[i].symbol;
        //stock.MostLiquidExchange = stockList[i].symbol;
        //stock.CategoryOrIndustry = stockList[i].symbol;
        //stock.Open = stockList[i].symbol;
        //stock.Close = stockList[i].symbol;
        if(type === 'Open'){
          stock.Open = element.price;
          saveInStockHistory(element);
        }
        if(type === 'Close'){
          stock.Close = element.price;
          saveInStockHistory(element);
        }
        stock.High = element.day_high;
        stock.Low = element.day_low;
        stock.Last = element.price;
        //stock.LastSize = stockList[i].symbol;
        stock.Volume = element.volume;
        //stock.PreviousClose = stockList[i].symbol;

        stock.ChangeFromPreviousClose = element.change;
        stock.PercentChangeFromPreviousClose = element.chg_percent;
        stock.High52Weeks = element.year_high;
        stock.Low52Weeks = element.year_low;
        //stock.Currency = stockList[i].symbol;
        //stock.TradingHalted = stockList[i].symbol;
        stock.Time = element.utctime;

        //console.log(stock);
        var query = {'Symbol':stock.Symbol};

        Stock.update(query, stock, function(err) {
    if (err) {
      
       console.log( "message:" + errorHandler.getErrorMessage(err));
      
    } else {
      
    }
  });

      }
    

  });

    // raw response 
    
  });
}

function createStock() {
  console.log("creating stock");
  var list = "";
 var symlist = list.split(',');
for(var j = 0; j < symlist.length; j++){

  var stock = new Stock();
  stock.Symbol = symlist[j];
  stock.save(function(err) {
    if (err) {
      
        console.log("message:" + errorHandler.getErrorMessage(err));
      
    } else {
      console.log("success");
    }
  });

}
}


function deleteStock(stock){

stock.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('stock removed');
    }
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

function saveInStockHistory(element){

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
//entry, commission setup, interest rate setup etc

//Player ranking System/
//npm ranking 

// User performance and Transaction Listing
//payment paypal and money (transaction hstory)
//--Question


//User communication system for interacting on game page.
//do with live fyre

//Winning game
// --  