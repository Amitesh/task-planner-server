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

router.get('/tasks-list', (req, res) => {
   res.json(db.tasksList.find());
});

router.post("/tasks-list", (req, res) => {
   const listItem = req.body;
   console.log('Adding new task list: ', listItem);

   // add new list item to db
   db.tasksList.save(listItem);

   // return updated list
   res.json(db.tasksList.find());
});

// update an item
router.put("/tasks-list/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;
   console.log("Editing item: ", itemId, " to be ", item);

   db.tasksList.update({ id: itemId }, item);

   res.json(db.tasksList.find());
});

// delete item from list
router.delete("/tasks-list/:id", (req, res) => {
   const itemId = req.params.id;
   console.log("Delete item with id: ", itemId);

   db.tasksList.remove({ id: itemId });

   res.json(db.tasksList.find());
});

app.use(router);
const  port  =  process.env.PORT  ||  3000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});