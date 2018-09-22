const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const MongoClient = require('mongodb').MongoClient;
const service = require('feathers-mongodb');

const ObjectID = require('mongodb').ObjectID;


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
  paginate: {
    default: 2,
    max: 10
  }
}));


// A basic error handler, just like Express
app.use(express.errorHandler());

// Connect to your MongoDB instance(s)
MongoClient.connect('mongodb://wiesnUser77:aLrLFmZIWti7@ds163162.mlab.com:63162/wiesn-hackathon')
  .then(function(client){
    // Set the model now that we are connected
    app.service('beerChallenge').Model = client.db('wiesn-hackathon').collection('beerChallenge');

    // Now that we are connected, create a dummy Message
      app.service('beerChallenge').create({
      date: Date.now(),
      name:"Mike",
      daysPresent: 1
    }).then(message => console.log('Created user', message));

            app.service('beerChallenge').create({
      date: Date.now(),
      name:"Averal",
      daysPresent: 4
    }).then(message => console.log('Created user', message));
                  app.service('beerChallenge').create({
      date: Date.now(),
      name:"Can",
      daysPresent: 11
    }).then(message => console.log('Created user', message));
                        app.service('beerChallenge').create({
      date: Date.now(),
      name:"Joe",
      daysPresent: 8
    }).then(message => console.log('Created user', message));

  }).catch(error => console.error(error));



// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});
