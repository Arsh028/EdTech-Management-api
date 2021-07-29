const express = require('express');
const connectdb = require('./database');

const app = express();

connectdb();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('working');
});

app.listen(PORT, () => {
  console.log('server started on port ' + PORT);
});
