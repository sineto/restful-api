const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

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
