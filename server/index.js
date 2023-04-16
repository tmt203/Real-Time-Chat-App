// MODULES 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoute = require('./route/userRoute');
const chatRoute = require('./route/chatRoute');
const messageRoute = require('./route/messageRoute');

// INITS
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;
const db = process.env.MONGODB_URI;


// MIDDLEWARES
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

app.get('/', (req, res) => {
  res.send('Welcome to chat app APIs 😘');
});


// Run the server
app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

// DATABASE
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log('MongoDB connection failed: ', error.message));