var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017');

var MarketRate = require('./models/marketRate');

var app = express();
var router = express.Router();

app.use(bodyParser.json());

router.use(function(request, response, next) {
  console.log("recieved request: " + request.method + " " + request.originalUrl);
  next();
});

router.get('/', function(request, response){
  response.json({ message:'hello!' });
});

router.route('/rates')

  .get(function(request, response) {

    //grabs the zip code from /rates/?zipCode=12345 <----
    var zipCodeQuery = request.query.zipCode;

    //if a zipCode query param was provided...
    if(zipCodeQuery){

      //searches the market rate schema for a market rate that has the
      //zip code provided in the query string parameter.
      MarketRate.find({ zipCode:zipCodeQuery }, function(error, rate){
        if(error){ response.send(error); }
        response
          .status(200)
          .json(rate);
      });

    }else{
      
      //get all market prices.
      MarketRate.find({}, function(error, rate){
        if(error){ response.send(error); }
        response
          .status(200)
          .json(rate);
      });
    }
  })

  .post(function(request, response){
    var newMarketRate = new MarketRate();
    newMarketRate.zipCode = request.body.zipCode;
    newMarketRate.rate = request.body.rate;

    newMarketRate.save(function(error){
      if(error){ response.send(error); }
      response
        .status(201)
        .json({ message: "Successfully created a new market rate." });
    });
  });

router.route('/rates/:rate_id')

  .delete(function(request, response){
    var rateId = request.params.rate_id;

    MarketRate.remove({ _id: rateId }, function(error, rate){
      if(error){ resonse.send(error); }

      response
        .status(200)
        .json({ message: "Successfully removed the market rate with an ID of " + rateId + "." });
    });
  });

app.use('/api', router);

app.listen(3000, function(){
  console.log("Hello World: Listening on port 3000.");
});
