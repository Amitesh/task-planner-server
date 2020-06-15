const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

module.exports = function (router, db) {
    
    function findTaskList(taskListId){
        return db.tasksList.findOne({_id: taskListId});
    }

    function filterTask(taskListId, taskId){
        let taskList = findTaskList(taskListId);
        let tasks = _.filter(taskList.tasks, (task) => {
            return task._id != taskId;
        });
        return tasks;
    }

    var options = {
        multi: false,
        upsert: true
     };

    router.get('/tasks-list/:tasklistid/tasks', (req, res) => {
        let taskList = findTaskList(req.params.tasklistid);
        res.json(taskList.tasks || []);
     });

     router.post("/tasks-list/:tasklistid/tasks", (req, res) => {
        const listItem = req.body;
        const taskListId = req.params.tasklistid;
        console.log('Adding new task list: ', listItem, taskListId);
        
        let taskList = findTaskList(taskListId);
        // if we are updating task from one list to another list then we don't have to generate the id again.
        listItem._id = listItem._id || uuidv4(); 
        console.log('==== tasklist =>', taskList);
        taskList.tasks = taskList.tasks || [];
        taskList.tasks.push(listItem);

        console.log('creating tasks =>', taskList);
        // add new list item to db
        let result = db.tasksList.update({ _id: taskListId }, taskList, options);
        console.log('after update', result, taskList);
        console.log('from db ', findTaskList(taskListId));
        // return updated list
        res.json(findTaskList(taskListId));
     });
     
     // update an item
     router.put("/tasks-list/:tasklistid/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskListId = req.params.tasklistid;
        const task = req.body;
        console.log("Editing item: ", taskId, " to be ", task);
        
        let tasks = filterTask(taskListId, taskId);
        tasks.push(task);
        let taskList = findTaskList(taskListId);
        taskList.tasks = tasks;
        // add new list item to db
        db.tasksList.update({ _id: taskListId }, taskList, options);
     
        // return updated list
        res.json(findTaskList(taskListId));
     });
     
     // delete item from list
     router.delete("/tasks-list/:tasklistid/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskListId = req.params.tasklistid;
        console.log("Delete item with id: ", taskId);
        
        let taskList = findTaskList(taskListId);
        taskList.tasks = filterTask(taskListId, taskId);
        // add new list item to db
        db.tasksList.update({ _id: taskListId }, taskList, options);
     
        // return updated list
        res.json(findTaskList(taskListId));
     });
};