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
   notificationHandler = require(path.resolve('./modules/notifications/server/controllers/notifications.server.controller')),
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
    game.game_startTime = new Date(game.game_startTime).setHours(9,0,0);
    game.game_endTime = new Date(game.game_endTime).setHours(21,0,0);
    game.game_startTime =  game.game_startTime.toISOString();
    game.game_endTime = game.game_endTime.toISOString();

console.log(game);
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

        var notification = {};
        notification.message = "You Just added a game";
        notification.user = req.user;
        notification.href = "/games/"+game._id;
        notification.image = "/imgaes/gamenotify.png";
        notification.category = "game";

        notificationHandler.sendNotification(notification);
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
  //rule.second = 40;
  rule.hour =9;
  cron.scheduleJob(rule, function(){
    gameStateChange();
  });
  //new Date(new Date().setDate(new Date().getDate()-1))


  var minutes = 20, the_interval = minutes * 60 * 1000;
  setInterval(function() {
  console.log("I am doing my 5 minutes check");
  // do your stuff here
    gameLeaderBoardChange();
  }, the_interval);



  function gameLeaderBoardChange(){
    var query = null;
    var winningArray = [];
      Game.find({game_status : 'Running'}).sort('-created').populate('user').exec(function(err, games) {
        if (err) {
          console.log("message:" + errorHandler.getErrorMessage(err));

        } else {
          
          for(var j = 0; j < games.length; j++){
            var game = games[j];
            var query = {game:game._id};
            Player.find(query).sort('-created').populate('user').populate('game', 'game_name').exec(function(err, players) {
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
              var totalStock = playermoves.length;
              var totalMoney = 0;
              for (var j = 0; j < playermoves.length; j++) {
                playername = playermoves[j].player.player_username;
                totalMoney = totalMoney + (playermoves[j].stock_unit * playermoves[j].stock.Last);
              }

              winningArray.push({playername:playername,totalMoney:totalMoney,totalStock:totalStock,winingAmount:0});
              winningArray.sort(function(a, b) {
                return parseFloat(b.totalMoney) - parseFloat(a.totalMoney);
              });
              if(players.length == winningArray.length){
                console.log(winningArray); 
                game.winningArray = winningArray;
                game.save(function(err) {
                if (err) {
                  console.log("Game LeaderBoard Faliure");
                } else {
                  console.log("Game LeaderBoard Updated" + game.game_name);
                }
              });
                
              }
            }
          });
          }
        }
      });

          }
        }
      });

    }



  function gameStateChange(query){

    console.log("Date last:" + new Date(new Date().setDate(new Date().getDate()-2)));

    var startDate = new Date(new Date().setDate(new Date().getDate()-10)).toISOString();
    var endDate = new Date().toISOString();
    console.log("start"+startDate+"end"+endDate);

    Game.find({ $or:[
      {game_startTime: {
        $gte: new Date(new Date().setDate(new Date().getDate()-10)),
        $lte: new Date()
      }},
      {game_endTime: {
        $gte: new Date(new Date().setDate(new Date().getDate()-10)),
        $lte: new Date()
      }}

    ]}).sort('-created').populate('user').exec(function(err, games) {
      if (err) {
        console.log("message:" + errorHandler.getErrorMessage(err));

      } else {
        //console.log(games);
        console.log("Game state change for "+games.length);
        var currentDate = new Date();
        console.log("currentDate"+currentDate);
        for(var j = 0; j < games.length; j++){
          if(currentDate > games[j].game_startTime && games[j].game_status === 'Open' && games[j].game_player < games[j].game_minPlayer ){
            cancelGame(games[j]);
          }

          else if(currentDate > games[j].game_startTime && games[j].game_status === 'Open'){
            startGame(games[j]);
          }
          
          else if(currentDate > games[j].game_endTime && games[j].game_status === 'Running'){
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
        console.log("Game Start Failure");
      } else {
       console.log("Game Started Done" + game.game_name);
       startGameNotification(game);
      }
    });
  }


  function cancelGame(game){
    game.game_status = 'Cancelled';
    game.save(function(err) {
       if (err) {
        console.log("Game Cancel Failure");
      } else {
       console.log("Game Cancel Done" + game.game_name);
       refundGameFees(game);
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

function startGameNotification(game){
    var query = {game:game._id};
    console.log('Game start notification');
    Player.find(query).sort('-created').populate('user').populate('game', 'game_name').exec(function(err, players) {
      if (err) {
        console.log("message"+ errorHandler.getErrorMessage(err));
      } else {

        console.log(players.length);

        game.game_EntryMoney = players.length * game.game_EntryFee;

        for (var i = 0; i < players.length; i++) {

          
          var notification = {};
          notification.message = "Game Started, Best of luck - "+game.game_name;
          notification.user = players[i].user._id;
          notification.href = "/games/"+game._id;
          notification.image = "/imgaes/gamenotify.png";
          notification.category = "game";

          notificationHandler.sendNotification(notification);
          
        }



      }
    });


  }



  function refundGameFees(game){
    var query = {game:game._id};
    var winningArray = [];
    console.log('Game cancellation');
    Player.find(query).sort('-created').populate('user').populate('game', 'game_name').exec(function(err, players) {
      if (err) {
        console.log("message"+ errorHandler.getErrorMessage(err));
      } else {

        console.log(players.length);

        game.game_EntryMoney = players.length * game.game_EntryFee;

        for (var i = 0; i < players.length; i++) {

          var userObject = {};
          userObject.winingAmount = game.game_EntryFee;
          userObject.playername = players[i].user.username;

          var description = 'Game Cancellatiion Money Refund of - ' + game.game_name;

          
          updateUserBalance('ADD', userObject, game, description);
          
        }



      }
    });


  }


 

  function calculateWinner(game){
    var query = {game:game._id};
    var winningArray = [];
    console.log('winning calculation');
    Player.find(query).sort('-created').populate('user').populate('game', 'game_name').exec(function(err, players) {
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

            winningArray.push({playername:playername,totalMoney:totalMoney,winingAmount:0});
            winningArray.sort(function(a, b) {
              return parseFloat(b.totalMoney) - parseFloat(a.totalMoney);
            });
            if(players.length == winningArray.length){
              console.log(winningArray); 
              priceDistribution(game, winningArray);
              
            }
            


          }
        });
          
        var notification = {};
        notification.message = "Game Complete, please check your luck - "+game.game_name;
        notification.user = players[i].user._id;
        notification.href = "/games/"+game._id;
        notification.image = "/imgaes/gamenotify.png";
        notification.category = "game";

        notificationHandler.sendNotification(notification);
        }



      }
    });


  }




  function priceDistribution(game, winningArray){

    var commision = (game.game_EntryMoney * game.game_winningRule.value_2)/100;

    var winnerMoney = game.game_EntryMoney - commision;

    game.game_prize = winnerMoney; 

    var admin = updateAdminBalance('ADD', commision, game);

    if(game.game_winningRule.key === 'winner_take_all'){
      winningArray[0].winingAmount = winnerMoney;
      
    }

    if(game.game_winningRule.key === 'top_2_winner'){
      winningArray[0].winingAmount = (winnerMoney *65)/100;
      winningArray[1].winingAmount = (winnerMoney *35)/100;
    }

    if(game.game_winningRule.key === 'top_3_winner'){
      winningArray[0].winingAmount = (winnerMoney *50)/100;
      winningArray[1].winingAmount = (winnerMoney *30)/100;
      winningArray[2].winingAmount = (winnerMoney *20)/100;
    }

    if(game.game_winningRule.key === 'top_5_winner'){
      winningArray[0].winingAmount = (winnerMoney *30)/100;
      winningArray[1].winingAmount = (winnerMoney *25)/100;
      winningArray[2].winingAmount = (winnerMoney *20)/100;
      winningArray[3].winingAmount = (winnerMoney *15)/100;
      winningArray[4].winingAmount = (winnerMoney *10)/100;
      
    }

    if(game.game_winningRule.key === 'top_10_winner'){
      winningArray[0].winingAmount = winnerMoney;
      
    }

    if(game.game_winningRule.key === '50_50'){
      winningArray[0].winingAmount = (winnerMoney *50)/100;
      winningArray[1].winingAmount = (winnerMoney *50)/100;

      
    }

    if(game.game_winningRule.key === 'prize_payout'){

      var min = 0;
      var max = 0;
      var money = 0;
      var payout = game.game_payOut;

      for (var i = 0; i < payout.length; i++) {
        
        min = payout[i].min;
        max = payout[i].max;
        money = payout[i].money;

        for (var j = min; j <= max; i++) {
          winningArray[j].winingAmount = money;
        }

      }
      
    }

    var new_winningarray = [];

    for (var k = 0; k <= winningArray.length; i++) {

      if(winningArray[k].winingAmount > 0){

      var description = 'Game Winning Money of' + game.game_name;

      updateUserBalance('ADD', winningArray[k], game, description);
      new_winningarray.push(winningArray[k]);
      }

      if(k == winningArray.length){
        closeGame(game, new_winningarray);
      }

    }

    
    


  }









  function updateAdminBalance(type, amount, game){
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
            var paymenthistory = new Paymenthistory();

            paymenthistory.amount = amount;
            paymenthistory.payment_method = 'GameCommission' ; 
            paymenthistory.type = 'credit';
            paymenthistory.status = 'success';
            paymenthistory.description = 'Game Commission of ' + game.game_name;
            paymenthistory.game = game._id;
            paymenthistory.user = admin._id;
            paymenthistory.username = admin.username;

            savePaymentHistory(paymenthistory);

            var notification = {};
            notification.message = "Game Complete, please see report -"+game.game_name;
            notification.user = admin._id;
            notification.href = "/paymenthistories";
            notification.image = "/imgaes/paymentnotify.png";
            notification.category = "payment";

            notificationHandler.sendNotification(notification);

            return admin;
          }
        });
        }
      });
  }

  function updateUserBalance(type, winingObject, game, description){
    var username = winingObject.playername;
    var amount =  winingObject.winingAmount;

    User.find({'username':username}, '-salt -password').sort('-created').exec(function(err, users) {
        if (err) {
          console.log(err);
        } else {
           console.log(users);
          var user = users[0];
          if(type === 'ADD'){
            user.user_balance = user.user_balance + amount;
            user.user_points = user.user_points +1;
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
            paymenthistory.description = description;
            paymenthistory.game = game._id;
            paymenthistory.user = user._id;
            paymenthistory.username = user.username;

            savePaymentHistory(paymenthistory);
            console.log('successfully added to User account');

            var notification = {};
            notification.message = description +game.game_name;
            notification.user = user._id;
            notification.href = "/paymenthistories";
            notification.image = "/imgaes/paymentnotify.png";
            notification.category = "payment";

            notificationHandler.sendNotification(notification);
          }
        });
        }
      });
  }

  function savePaymentHistory(paymenthistory){

    paymenthistory.save(function(err) {
    if (err) {
      console.log("error in payment save");
    } else {
      
      console.log("paymentHistory saved");
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
          console.log("sorry! Message sending fail");
        }
      });

  }
  }

