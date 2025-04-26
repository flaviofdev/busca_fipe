const express = require('express');
const cors = require('cors');
const fipeRoutes = require('./routes/fipeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/fipe', fipeRoutes);

module.exports = app;