const express = require('express');
const connectdb = require('./database');

const app = express();

connectdb();

app.use(express.json({ extended: true }));

app.get('/', (req, res) => {
  res.send('working');
});

//define route
app.use('/user', require('./routes/user'));
app.use('/role', require('./routes/role'));
app.use('/student', require('./routes/student'));
app.use('/school', require('./routes/school'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server started on port ' + PORT);
});
