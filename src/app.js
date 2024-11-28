// express, a web framework for Node.js
const express = require('express');
// For interacting with the file system
const path = require('path');
// For parsing the body of incoming requests
const bodyParser = require('body-parser');
// For interacting with the database
const sequelize = require('./framework/db/postgresql/config');

// Load environment variables
require('dotenv').config();

// Connect to the database
sequelize.sync()
    .then(() => console.log('Database connected'))
    .catch(console.error);

const app = express();
// Static files
app.use('/', express.static(path.join(__dirname, 'public')));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
app.use(bodyParser.json());

// Routes
app.use('/api', require('./controllers/routes/userRoute'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});