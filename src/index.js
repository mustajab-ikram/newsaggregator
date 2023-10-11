const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { login, register } = require('./controller/authController');
const verifyToken = require('./middleware/authJWT');
const newsData = require('./db/newsData.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 3000 || process.env.PORT;

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

try {
  mongoose.connect('mongodb://localhost:27018/usersdb', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log('Connected to DB now.');
} catch (err) {
  console.log('Some error occured while connecting to the DB.');
}

app.post('/register', register);
app.post('/login', login);

app.get('/news', verifyToken, (req, res) => {
  if (!req.user && req.message == null) {
    res.status(403).send({
      message: 'Invalid JWT token',
    });
  } else if (!req.user && req.message) {
    res.status(403).send({
      message: req.message,
    });
  }
  return res.statsu(200).send(newsData);
});

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Process is running at http://localhost:${PORT}`);
});
