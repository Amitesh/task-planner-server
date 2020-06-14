'use strict';
import express, { Router } from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import { connect } from 'diskdb';


const  app  =  express();
const  router  =  Router();
app.use(cors())
router.use(urlencoded({ extended:  false }));
router.use(json());

// diskdb connection
connect('./data', ['tasksList']);

router.get('/tasks-list', (req, res) => {
   res.json(tasksList.find());
});

router.post("/tasks-list", (req, res) => {
   const listItem = req.body;
   console.log('Adding new task list: ', listItem);

   // add new list item to db
   tasksList.save(listItem);

   // return updated list
   res.json(tasksList.find());
});

// update an item
router.put("/tasks-list/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;
   console.log("Editing item: ", itemId, " to be ", item);

   tasksList.update({ id: itemId }, item);

   res.json(tasksList.find());
});

// delete item from list
router.delete("/tasks-list/:id", (req, res) => {
   const itemId = req.params.id;
   console.log("Delete item with id: ", itemId);

   tasksList.remove({ id: itemId });

   res.json(tasksList.find());
});

app.use(router);
const  port  =  process.env.PORT  ||  3000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});