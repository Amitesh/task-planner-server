const { v4: uuidv4 } = require('uuid');
const _array = require('lodash/array');

module.exports = function (router, db) {
    
    function findTaskList(taskListId){
        return db.tasksList.find({_id: taskListId});
    }
    function filterTask(taskListId, taskId){
        let taskList = findTaskList(taskListId);
        let tasks = _array.filter(taskList.tasks, (task) => {
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
        listItem._id = uuidv4();
        taskList.tasks = taskList.tasks || [];
        taskList.tasks.push(listItem);

        console.log('creating tasks =>', taskList);
        // add new list item to db
        // let result = db.tasksList.update({ _id: taskListId }, taskList, options);
        
        let allTasksList = db.tasksList.find();
        let filteredTasksList = _array.filter(allTasksList, (tasksList) => {
            db.tasksList.remove({ _id: tasksList._id });
            return tasksList._id != taskListId;
        });
        filteredTasksList.push(taskList);
        db.tasksList.save(filteredTasksList);

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
        taskList.tasks = tasks;
        // add new list item to db
        db.tasksList.update({ _id: taskListId }, taskList, options);
     
        // return updated list
        res.json(taskList);
     });
     
     // delete item from list
     router.delete("/tasks-list/:tasklistid/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskListId = req.params.tasklistid;
        console.log("Delete item with id: ", taskId);
        
        taskList.tasks = filterTask(taskListId, taskId);
        // add new list item to db
        db.tasksList.update({ _id: taskListId }, taskList, options);
     
        // return updated list
        res.json(taskList);
     });
};