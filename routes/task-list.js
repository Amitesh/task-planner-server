const utils = require('./utils.js');

/**
 * Module to provide RESTful api for TaskList resource
 * @param {*} router Router objet
 * @param {*} db DiskDb connection object
 */

module.exports = function (router, db) {
   /**
    * Api method to provide the all tasklist resources
    */
   router.get("/tasks-list", (req, res) => {
      res.json(db.tasksList.find());
   });

   /**
    * Api method to create/add a new tasklist
    */
   router.post("/tasks-list", (req, res) => {
      const taskList = req.body;
      if (utils.isValidName(taskList && taskList.name)) {
         taskList.name = taskList.name.trim();
         // add new list item to db
         db.tasksList.save(taskList);
         // return updated list
         res.json(db.tasksList.find());
      }
      else {
         res.status(422).json({ status: 422, message: 'Invalid task list name.' });
      }

   });

   /**
    * Api Method to update the tasklist item
    */
   router.put("/tasks-list/:id", (req, res) => {
      const taskListId = req.params.id;
      const taskList = req.body;
      if (utils.isValidName(taskList && taskList.name)) {
         taskList.name = taskList.name.trim();
         db.tasksList.update({ _id: taskListId }, taskList);
         res.json(db.tasksList.find());
      }
      else {
         res.status(422).json({ status: 422, message: 'Invalid task list name.' });
      }
   });

   /**
    * Api method to delete a tasklist by it's id
    */
   router.delete("/tasks-list/:id", (req, res) => {
      const taskListId = req.params.id;
      db.tasksList.remove({ _id: taskListId });
      res.json(db.tasksList.find());
   });
};
