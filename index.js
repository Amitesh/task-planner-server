'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('diskdb');


const app = express();
const router = express.Router();
app.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Create diskdb connection
db.connect('./data', ['tasksList']);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'webapp')));
app.use(express.static(path.join(__dirname, 'webapp/assets/images')));

// Add all route files for Task List and Task
require('./routes/task-list')(router, db);
require('./routes/task')(router, db);

app.use(router);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});