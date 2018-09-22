const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const MongoClient = require('mongodb').MongoClient;
const service = require('feathers-mongodb');

const ObjectID = require('mongodb').ObjectID;

// get the mongodb config, use to avoid pushing to Github
// add config directory to .gitignore
const local_production = require('./config/env/local-production.js');
//console.log('uri',local_production.MONGODB_URI);

// Create an Express compatible Feathers application instance.
const app = express(feathers());

// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));
// Enable REST services
app.configure(express.rest());
// Enable Socket.io
app.configure(socketio());

// Connect to the db, create and register a Feathers service.
app.use('/beerChallenge', service({
  paginate: false
  
}));


// A basic error handler, just like Express
app.use(express.errorHandler());

// Connect to your MongoDB instance(s)
MongoClient.connect(local_production.MONGODB_URI)
  .then(function(client){
    // Set the model now that we are connected
    app.service('beerChallenge').Model = client.db('wiesn-hackathon').collection('beerChallenge');

    // Now that we are connected, create a dummy Message
   //   app.service('beerChallange').create({
   //   text: 'test1'
   // }).then(message => console.log('Created message', message));
  }).catch(error => console.error(error));


app.service('beerChallenge').hooks({
  before: {
    find(context) {
 //     query: {
 //   $sort: {
 //     daysPresent: -1
 //   }
 // }
      const { query = {} } = context.params;

      if(query._id) {
        query._id  = new ObjectID(query._id);
      }

       if(query.date !== undefined) {
        query.date = query.date ;
      }
      if(query.name !== undefined) {
        query.name = query.name ;
      }
      if(query.daysPresent !== undefined) {
        query.daysPresent = parseInt(query.daysPresent, 10) ;
       // context.params.query.$sort.rank = parseInt(query.$sort.rank);
      }
// sort results on daysPresent
      if(!query.$sort) {
      query.$sort = {
        daysPresent: -1
      }
    }

      context.params.query = query;
      //context.params.query = query.daysPresent.$sort.rank ;

      return Promise.resolve(context);
    }
  }
});




// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});
