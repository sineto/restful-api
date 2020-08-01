const express = require('express');
const bodyParser = require('body-parser');

const errorHandler = require('./src/middlewares/error-handler');
const router = require('./src/routers');

const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());

// global router
app.use(router);

app.get('/', (req, res) => {
  res.send({ message: 'hello there!' });
});

// global error handler
// should always at the end of application stack:
// before the listener and after include routes
// https://stackoverflow.com/questions/29700005/express-4-middleware-error-handler-not-being-called
app.use(errorHandler);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, (error) => {
  if (error) {
    console.log('Server error:', error);
  }

  console.log(`Server started at http://${HOST}:${PORT}`);
});

module.exports = app;
