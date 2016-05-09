  'use strict';

  /**
   * Module dependencies.
   */
   var path = require('path'),
   mongoose = require('mongoose'),
   Game = mongoose.model('Game'),
   Player = mongoose.model('Player'),
   Adminstuf = mongoose.model('Adminstuf'),
   User = mongoose.model('User'),
   Paymenthistory = mongoose.model('Paymenthistory'),
   Playermove = mongoose.model('Playermove'),
   config = require(path.resolve('./config/config')),
   nodemailer = require('nodemailer'),
   errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
   _ = require('lodash');



   var smtpTransport = nodemailer.createTransport(config.mailer.options);

   var cron = require('node-schedule');

   var http = require('http');



  /**
   * Create a Game
   */
   exports.create = function(req, res) {

    var game = new Game(req.body);
    game.user = req.user;

    game.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
         if(game.game_type === 'private' ){
            var httpTransport = 'http://';
            if (config.secure && config.secure.ssl === true) {
            httpTransport = 'https://';
            }

            res.render(path.resolve('modules/users/server/templates/gameinvite-email'), {
            name: req.user.displayName,
            appName: config.app.title,
            url: httpTransport + req.headers.host + '/games/' + game._id
          }, function (err, emailHTML) {
            console.log("mail" + err + emailHTML);
          inviteFreinds(game, emailHTML);
      });
        }

        res.jsonp(game);
      }
    });
  };

  /**
   * Show the current Game
   */
   exports.read = function(req, res) {
    // convert mongoose document to JSON
    var game = req.game ? req.game.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    game.isCurrentUserOwner = req.user && game.user && game.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(game);
  };

  /**
   * Update a Game
   */
   exports.update = function(req, res) {
    var game = req.game ;

    game = _.extend(game , req.body);

    game.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(game);
      }
    });
  };

  /**
   * Delete an Game
   */
   exports.delete = function(req, res) {
    var game = req.game ;

    game.remove(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(game);
      }
    });
  };

  /**
   * List of Games
   */
   exports.list = function(req, res) { 
    Game.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, games) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(games);
      }
    });
  };


  /**
* Paginate List games
**/
exports.gamelist = function(req, res){
 
    if(!req.params.page)
    {
        var page = 1;
    }else{
        var page = req.params.page;
    }
    var per_page =10;
 
    Game.find(req.query).sort('-created').skip((page-1)*per_page).limit(per_page).populate('user', 'displayName').exec(function(err, games) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(games);
        }
    });
 
};


  /**
   * Game middleware
   */
   exports.gameByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Game is invalid'
      });
    }

    Game.findById(id).populate('user', 'displayName').exec(function (err, game) {
      if (err) {
        return next(err);
      } else if (!game) {
        return res.status(404).send({
          message: 'No Game with that identifier has been found'
        });
      }
      req.game = game;
      next();
    });
  };


  /* run the job at 18:55:30 on Dec. 14 2018*/
  var rule = new cron.RecurrenceRule();
  rule.seconds = 40;
  //rule.hours = 5;
  cron.scheduleJob(rule, function(){
    gameStateChange();
  });
  //new Date(new Date().setDate(new Date().getDate()-1))



  function gameStateChange(query){

    Game.find({
      game_startTime: {
        $gte: new Date("2016-03-16T18:00:00.000Z"),
        $lte: new Date("2016-03-18T18:40:00.000Z")
      }
    }).sort('-created').populate('user', 'displayName').exec(function(err, games) {
      if (err) {
        console.log("message:" + errorHandler.getErrorMessage(err));

      } else {
        //console.log(games);
        var currentDate = new Date();
        for(var j = 0; j < games.length; j++){
          if(currentDate > games[j].game_startTime && games[j].game_status === 'Open'){
            startGame(games[j]);
          }
          if(currentDate > games[j].game_endTime && games[j].game_status === 'Running'){
            calculateWinner(games[j]);
          }

        }
      }
    });

  }


  function startGame(game){
    game.game_status = 'Running';
    game.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(game);
      }
    });
  }

  function closeGame(game, winningArray){

    game.game_status = 'Closed';
    game.winningArray = winningArray;
    game.save(function(err) {
      if (err) {
        
         console.log("message:" + errorHandler.getErrorMessage(err));
       
      } else {
        console.log('Game Closed and Price money is next');
        
      }
    });

  }

  function calculateWinner(game){
    var query = {game:game._id};
    var winningArray = [];
    console.log('winning calculation');
    Player.find(query).sort('-created').populate('user', 'displayName').populate('game', 'game_name').exec(function(err, players) {
      if (err) {
        console.log("message"+ errorHandler.getErrorMessage(err));

        
      } else {

        console.log(players.length);

        game.game_EntryMoney = players.length * game.game_EntryFee;

        for (var i = 0; i < players.length; i++) {
          query = {player:players[i]._id};

          Playermove.find(query).sort('-created').populate('player', 'player_username').populate('stock').exec(function(err, playermoves) {

            if (err) {
             console.log("message"+ errorHandler.getErrorMessage(err));
           } else {
            console.log(playermoves.length);
            var playername = '';
            var totalMoney = 0;
            for (var j = 0; j < playermoves.length; j++) {
              playername = playermoves[j].player.player_username;
              totalMoney = totalMoney + (playermoves[j].stock_unit * playermoves[j].stock.Last);
            }

            winningArray.push({playername:playername,totalMoney:totalMoney});
            winningArray.sort(function(a, b) {
              return parseFloat(b.totalMoney) - parseFloat(a.totalMoney);
            });
            if(players.length == winningArray.length){
              console.log(winningArray); 
              priceDistribution(game, winningArray);
              
            }
            


          }
        });
          
        }



      }
    });


  }

  function priceDistribution(game, winningArray){

    if(game.game_winningRule.key === 'winner_take_all'){

      var commision = (game.game_EntryMoney * game.game_winningRule.value_2)/100;

      var winnerMoney = game.game_EntryMoney - commision;

      game.game_prize = winnerMoney; 

      var admin = updateAdminBalance('ADD', commision);

      var paymenthistory = new Paymenthistory();

      paymenthistory.amount = commision;
      paymenthistory.payment_method = 'GameCommission' ; 
      paymenthistory.type = 'credit';
      paymenthistory.status = 'success';
      paymenthistory.description = 'Game Commission of ' + game._id;
      paymenthistory.game = game._id;
      paymenthistory.user = admin._id;
      paymenthistory.username = admin.username;

      savePaymentHistory(paymenthistory);

      updateUserBalance('ADD', winningArray[0].playername, game, winnerMoney );
      


    }

    closeGame(game, winningArray);


  }

  function updateAdminBalance(type, amount){
    Adminstuf.find({'type':'balance'}).sort('-created').exec(function(err, adminstufs) {
        if (err) {
          console.log(err);
        } else {
          console.log(adminstufs);
          var admin = adminstufs[0];
          if(type === 'ADD'){
            admin.value_2 = admin.value_2 + amount;
          }else if(type === 'SUBSTRACT'){
            admin.value_2 = admin.value_2 - amount;
          }
          
          console.log(admin);
          admin.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('successfully added to admin account');
            return admin;
          }
        });
        }
      });
  }

  function updateUserBalance(type, username, game, amount){
    console.log(username);
    User.find({'username':username}, '-salt -password').sort('-created').exec(function(err, users) {
        if (err) {
          console.log(err);
        } else {
           console.log(users);
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
            paymenthistory.payment_method = 'GameAmount' ; 
            paymenthistory.type = 'credit';
            paymenthistory.status = 'success';
            paymenthistory.description = 'Game Winning Money of ';
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


  function inviteFreinds(game, emailHTML) {

    var inviteList = game.game_inviteList;

    for(var j = 0; j < inviteList.length; j++){

    var mailOptions = {
        to: inviteList[j],
        from: config.mailer.from,
        subject: 'Game Invitation ',
        html: emailHTML
      };

    smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          console.log(" Message sending successfully");
        } else {
          console.log("sorry Message sending fail");
        }
      });

  }
  }

