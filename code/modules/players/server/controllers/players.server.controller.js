'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Player = mongoose.model('Player'),
  Game = mongoose.model('Game'),
  User = mongoose.model('User'),
  Paymenthistory = mongoose.model('Paymenthistory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Player
 */
exports.create = function(req, res) {
  var player = new Player(req.body);
  player.user = req.user;

   updateGame(player,callback);


  function callback(result){

    if(result === true){
        player.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
     
      res.jsonp(player);
    }
  });
      
    }
      else {
        return res.status(400).send({
        message: ""
      });
      }

  }
};

/**
 * Show the current Player
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var player = req.player ? req.player.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  player.isCurrentUserOwner = req.user && player.user && player.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(player);
};

/**
 * Update a Player
 */
exports.update = function(req, res) {
  var player = req.player ;

  player = _.extend(player , req.body);

  player.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(player);
    }
  });
};

/**
 * Delete an Player
 */
exports.delete = function(req, res) {
  var player = req.player ;

  player.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(player);
    }
  });
};

/**
 * List of Players
 */
exports.list = function(req, res) { 
  console.log("yes this is request parameter");
  console.log(req.query);
  Player.find(req.query).sort('-created').populate('user', 'displayName').populate('game').exec(function(err, players) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(players);
    }
  });
};

/**
 * Player middleware
 */
exports.playerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Player is invalid'
    });
  }

  Player.findById(id).populate('user', 'displayName').exec(function (err, player) {
    if (err) {
      return next(err);
    } else if (!player) {
      return res.status(404).send({
        message: 'No Player with that identifier has been found'
      });
    }
    req.player = player;
    next();
  });
};


function updateGame(player,fn){
  //console.log(player);
  var gameid = player.game;
  Game.findById(gameid).exec(function (err, game) {
      if (err) {
      } else {

        if(game.game_player> game.game_minPlayer){
          fn(false);
        }else{
        game.game_player = game.game_player + 1;
        game.game_EntryMoney = game.game_EntryMoney + game.game_EntryFee; 

        game.save(function(err) {
          if (err) {
        
         console.log("message:" + errorHandler.getErrorMessage(err));
       
        } else {
        updateUserBalance('SUBSTRACT', player.player_username, game, game.game_EntryFee);
        console.log('Game Saved New Player added');
          
        fn(true);
      }
    });
      }
    }
    });

}


function updateUserBalance(type, username, game, amount){
    console.log(username);
    User.find({'username':username}, '-salt -password').sort('-created').exec(function(err, users) {
        if (err) {
          console.log(err);
        } else {
           //console.log(users);
          var user = users[0];
          if(type === 'ADD'){
            user.user_balance = user.user_balance + amount;
          }else if(type === 'SUBSTRACT'){
            user.user_balance = user.user_balance - amount;
          }
          

          user.save(function(err) {
          if (err) {
            
          } else {

            var paymenthistory = new Paymenthistory();
            
            paymenthistory.amount = amount;
            paymenthistory.payment_method = 'GameEntryFee' ; 
            paymenthistory.type = 'debit';
            paymenthistory.status = 'success';
            paymenthistory.description = 'Game Entry Fee Money of ';
            paymenthistory.game = game._id;
            paymenthistory.user = user._id;
            paymenthistory.username = user.username;

            savePaymentHistory(paymenthistory);
            console.log('successfully added to User account');
          }
        });
        }
      });
  }

  function savePaymentHistory(paymenthistory){

    paymenthistory.save(function(err) {
    if (err) {
      
    } else {
      
      console.log("next step");
    }
  });


  }
