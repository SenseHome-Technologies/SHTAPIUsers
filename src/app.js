// express, a web framework for Node.js
const express = require('express');
// For interacting with the file system
const path = require('path');
// For parsing the body of incoming requests
const bodyParser = require('body-parser');
// For interacting with the database
const sequelize = require('./framework/db/postgresql/config');
// A UI for interactively exploring an API
const swaggerUI = require('swagger-ui-express');
// The swagger definition for our API
const swaggerDocument = require('../public/swagger.json');

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

// Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// Swagger API documentation
app.use('/api-docjs', express.static('./public/apidocjs'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});