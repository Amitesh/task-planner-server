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
      const tasksList = req.body;
      // add new list item to db
      db.tasksList.save(tasksList);
      // return updated list
      res.json(db.tasksList.find());
   });

   /**
    * Api Method to update the tasklist item
    */
   router.put("/tasks-list/:id", (req, res) => {
      const taskListId = req.params.id;
      const taskList = req.body;

      db.tasksList.update({ _id: taskListId }, taskList);
      res.json(db.tasksList.find());
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
