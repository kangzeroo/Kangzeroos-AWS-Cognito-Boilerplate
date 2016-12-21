// Main starting point of the server
// this is a mix of ES6 and ES5 syntax because nodeJS does not yet fully support all ES6 at the time of writing this app
const express = require('express');
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express();
const router = require('./router');
const cors = require('cors');

// App setup
// morgan and bodyParser are middlewares. any incoming requests will be passed through each
app.use(morgan('tiny'));				// morgan is a logging framework to see incoming requests. used mostly for debugging
// CORS middleware (cross origin resource sharing) to configure what domain & ips can talk to our server api
// CORS is used for user security on web browsers. Enable CORS on server to allow all I.P. addresses
app.use(cors());
app.use(bodyParser.json({type:'*/*'}));		// bodyParser attempts to parse any request into JSON format

// we instantiate the router function that defines all our HTTP route endpoints
router(app);


// Server setup
// if there is an environment variable of PORT already defined, use it. otherwise use port 3091
const port = process.env.PORT || 3000;
// create a server with the native node http library
const server = http.createServer(app);
// listen to the server on port
server.listen(port);
console.log("Server listening on:", port);
