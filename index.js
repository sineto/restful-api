const express = require('express');
const bodyParser = require('body-parser');

const errorHandler = require('./src/middlewares/error-handler');
const router = require('./src/routers');

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// global error handler
app.use(errorHandler);

// global router
app.use(router);

app.get('/', (req, res) => {
  res.send({ message: 'hello there!' });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, (error) => {
  if (error) {
    console.log('Server error:', error);
  }

  console.log(`Server started at http://${HOST}:${PORT}`);
});
