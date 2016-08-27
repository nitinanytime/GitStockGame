'use strict';

/**
 * Module dependencies.
 */
 
var path = require('path'),
  mongoose = require('mongoose'),
  Paymenthistory = mongoose.model('Paymenthistory'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


var paymenthistory = null;

var paypal = require('paypal-rest-sdk');

var paypalConfig = {
    "host" : "api.sandbox.paypal.com",
    "port" : "",            
    "client_id" : "AY4AM0VDtR_Ec_0WFziHubfRk04V84_dLPtBAxioCjknPf0Ufp_qL08KwO_IiumRkEPVtDkg_On-5Q9J",
    "client_secret" : "EIEquePxE2BW4oQXe8bkTIRnWj9AH30jiZXab4J8XGjosCGFHftmjeQRbmXOxfE9lGlw6YwYMMJg0yBC"
  };

  paypal.configure(paypalConfig);


/**
 * Create a Payment
 */
exports.create = function(req, res) {
  paymenthistory = new Paymenthistory(req.body);
  paymenthistory.user = req.user;
  paymenthistory.username = req.user.username;

  paymenthistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(paymenthistory.type === 'debit'){
        updateUserMoney(paymenthistory);
        res.jsonp({redirectUrl:'/paymenthistories',message:'Successfully Paid'});
      }else{
        excecutePayment(paymenthistory, req, res);
      }
      console.log("next step");
    }
  });
};


exports.success = function(req, res) {
 console.log("success");

var id = req.query.id;
var payerId = req.query.PayerID;
var paymentId = req.query.paymentId;
Paymenthistory.findById(id).populate('user', 'displayName').exec(function (err, paymenthistory) {
    if (err) {
      res.redirect('/server-error');
    } else if (!paymenthistory) {
      return res.status(404).send({
        message: 'No Paymenthistory with that identifier has been found'
      });
    }else{
      paymenthistory.transactionId = paymentId;
      paymenthistory.paypalId = payerId;
      paymenthistory.status = "SUCCESS";
      paymenthistory.type = "credit";
      paymenthistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      updateUserMoney(paymenthistory);
      res.redirect('/success');
    }
  });
    }
    
  });


};

exports.cancel = function(req, res) {

var id = req.query.id;
Paymenthistory.findById(id).populate('user', 'displayName').exec(function (err, paymenthistory) {
    if (err) {
      res.redirect('/server-error');
    } else if (!paymenthistory) {
      return res.status(404).send({
        message: 'No Paymenthistory with that identifier has been found'
      });
    }else{
      
  paymenthistory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.redirect('/server-error');
    }
  });
    }
    
  });

  
};



/**
 * Show the current Paymenthistory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var paymenthistory = req.paymenthistory ? req.paymenthistory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  paymenthistory.isCurrentUserOwner = req.user && paymenthistory.user && paymenthistory.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(paymenthistory);
};

/**
 * Update a Paymenthistory
 */
exports.update = function(req, res) {
  var paymenthistory = req.paymenthistory ;

  paymenthistory = _.extend(paymenthistory , req.body);

  paymenthistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymenthistory);
    }
  });
};



/**
 * Update a Paymenthistory Via Admin
 */
exports.updateAdmin = function(req, res) {
  var paymenthistory = req.paymenthistory ;

  paymenthistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return {message:"Successfully Updated"};
    }
  });
};

/**
 * Delete an Paymenthistory
 */
exports.delete = function(req, res) {
  var paymenthistory = req.paymenthistory ;

  paymenthistory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymenthistory);
    }
  });
};

/**
 * List of Paymenthistories
 */
exports.list = function(req, res) { 
  Paymenthistory.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, paymenthistories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paymenthistories);
    }
  });
};


 /**
* Paginate List paymenthistories
**/
exports.paymenthistorieslist = function(req, res){
 
    if(!req.params.page)
    {
        var page = 1;
    }else{
        var page = req.params.page;
    }
    var per_page =10;
 
    Paymenthistory.find(req.query).sort('-created').skip((page-1)*per_page).limit(per_page).populate('user', 'displayName').exec(function(err, paymenthistories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(paymenthistories);
        }
    });
 
};

/**
 * Paymenthistory middleware
 */
exports.paymenthistoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Paymenthistory is invalid'
    });
  }

  Paymenthistory.findById(id).populate('user', 'displayName').exec(function (err, paymenthistory) {
    if (err) {
      return next(err);
    } else if (!paymenthistory) {
      return res.status(404).send({
        message: 'No Paymenthistory with that identifier has been found'
      });
    }
    req.paymenthistory = paymenthistory;
    next();
  });
};



function getPayment(paymenthistory,req){

console.log(req);
if(paymenthistory.payment_method === 'credit_card'){
var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "credit_card",
    "funding_instruments": [{
      "credit_card": req.body.creditCard
    }]
  },
  "transactions": [{
    "amount": {
      "total": paymenthistory.amount,
      "currency": "USD"
    },
    "description": paymenthistory.description
  }]
};
}
else{
var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": "http://45.33.55.110:3000/api/paymenthistories/success?id="+paymenthistory._id,
    "cancel_url": "http://45.33.55.110:3000/payments/cancel?id="+paymenthistory._id
  },
  "transactions": [{
    "amount": {
      "total": paymenthistory.amount,
      "currency": "USD"
    },
    "description": paymenthistory.description
  }]
};
}

return payment;
}

function updateUserMoney(paymenthistory){
var userid = paymenthistory.user._id;
var type = paymenthistory.type;
var amount = paymenthistory.amount;

User.findById(userid).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }else{
      if(type === 'credit'){
      user.user_balance = user.user_balance + amount;
      user.user_payments.credit = user.user_payments.credit+1;
    }
      else if(type === 'debit'){
        user.user_balance = user.user_balance - amount;
        user.user_payments.debit = user.user_payments.debit+1;
      }
      if(amount>=50 && type === 'credit' && user.user_payments.bonus == 0){
        user.user_balance = user.user_balance + 10;
        user.user_payments.bonus = user.user_payments.bonus+1;
        paymenthistory.description = "$10 bonus amount added for you first transaction";
        savePaymenthistory(paymenthistory);
      }

      user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

      });


    }

    
  });


}

function savePaymenthistory(paymenthistory){
  paymenthistory.save(function(err) {
    if (err) {
       console.log("Bonus Amount transaction Failed");
    } else {
      console.log("Bonus Amount Added");
    }
  });

}

function excecutePayment(paymenthistory, req, res){


  var payment = {};
  payment = getPayment(paymenthistory,req);
 


  paypal.payment.create(payment, function (error, payment) {
  if (error) {
    console.log("error came");
    res.jsonp({redirectUrl:redirectUrl,
              message:'Sorry Wrong Card Details'});
  } else {
      paymenthistory.transactionId = payment.id;
      console.log("else portion");
      if(payment.payer.payment_method === 'paypal') {
      req.session.paymentId = payment.id;
      var redirectUrl;
      for(var i=0; i < payment.links.length; i++) {
        var link = payment.links[i];
        if (link.method === 'REDIRECT') {
          redirectUrl = link.href;
        }
      }
      console.log("redirect"+redirectUrl);
      res.jsonp({redirectUrl:redirectUrl,message:'Please CLick to Next Button'});
    }else{
      paymenthistory.status= "SUCCESS";
      paymenthistory.type= "credit";
      paymenthistory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      updateUserMoney(paymenthistory);
      res.jsonp({redirectUrl:'/paymenthistories',message:'Successfully Paid'});
    }
  });
      }
  }
});
}

//---------------Payment Send After Admin Approval---------

exports.sendPayoutBulk = function (req, res){

  var query = {status:'APPROVED',
               type:'debit'};

  Paymenthistory.find(query).sort('-created').populate('user').exec(function(err, paymenthistories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      var payoutJson = getPayoutJson();
          for(var i=0; i<paymenthistories.length;i++){
            var item = getPayoutItem();
                item.receiver = 'praveen.mudaliar.2012-facilitator@gmail.com';
                item.sender_item_id = paymenthistories[i].user._id;
                item.amount.value = paymenthistories[i].amount;

            payoutJson.items.push(item);
          }



    paypal.payout.create(payoutJson, function (error, payout) {
        if (error) {
          console.log("--------1-----------");
          res.json({error: error});
          console.log(error.response);
      } else {
        console.log("----------2---------");
        console.log("Create Payout Response");
        console.log(payout);
        
        var id = payout.batch_header.payout_batch_id;
        console.log(id);

        paypal.payout.get(id, function (error, payout) {
    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log("Get Payout Response");
        console.log(payout);
        res.json({Success: payout});
    }
});
      }
    });
      console.log("--------3-----------");
    //  console.log(payoutJson);
     // res.json({RequestStatus: 'Done'});
    }
  });

}






function getPayoutJson(){

  var sender_batch_id = Math.random().toString(36).substring(9);
  var create_payout_json =  {
      sender_batch_header: {
          sender_batch_id: sender_batch_id,
          email_subject: "You have a payment from StreetFight"
      },
      items: [
      ]
  };

  return create_payout_json;
}

function getPayoutItem(){
  var payobject ={
            recipient_type: "EMAIL",
            amount: {
                value: 0,
                currency: "USD"
            },
            receiver: null,
            note: "Thank you.",
            sender_item_id: null
        };
    return payobject;
 }
