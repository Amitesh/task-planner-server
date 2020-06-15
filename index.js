'use strict';
const  express  =  require('express');
const  bodyParser  =  require('body-parser');
const cors = require('cors');
const db = require('diskdb');


const  app  =  express();
const  router  =  express.Router();
app.use(cors())
router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());

// diskdb connection
db.connect('./data', ['tasksList']);

require('./routes/task-list')(router, db);
require('./routes/task')(router, db);

app.use(router);
const  port  =  process.env.PORT  ||  3000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});