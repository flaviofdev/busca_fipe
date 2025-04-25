const express = require('express');
const fipeRoutes = require('./routes/fipeRoutes');

const app = express();
app.use(express.json());

app.use('/fipe', fipeRoutes);

module.exports = app;