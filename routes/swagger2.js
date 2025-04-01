// app.js or index.js
const express = require('express');
const app = express();
app.use(express.json());

app.use('/users', require('./usersRoute'));
app.use('/cards', require('./creditcardRoute'));

// (export or start the server)
