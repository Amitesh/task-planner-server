const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

/**
 * Module to provide RESTful api for Task resource
 * @param {*} router 
 * @param {*} db 
 */
module.exports = function (router, db) {
    /**
     * Method to find the tasklist by id
     * @param {string} taskListId 
     */
    function findTaskListById(taskListId) {
        return db.tasksList.findOne({ _id: taskListId });
    }

    /**
     * Method to find the task by it's id and parent tasklist id
     * @param {string} taskListId 
     * @param {string} taskId 
     */
    function filterTask(taskListId, taskId) {
        let taskList = findTaskListById(taskListId);
        let tasks = _.filter(taskList.tasks, (task) => {
            return task._id != taskId;
        });
        return tasks;
    }

    // Configurations for options for diskDb operations
    const options = {
        multi: false,
        upsert: true
    };

    /**
     * Api method to get the all tasks by tasklist id
     */
    router.get('/tasks-list/:tasklistid/tasks', (req, res) => {
        let taskList = findTaskListById(req.params.tasklistid);
        res.json(taskList.tasks || []);
    });

    /**
     * Api method to create/add new task
     */
    router.post("/tasks-list/:tasklistid/tasks", (req, res) => {
        const task = req.body;
        const taskListId = req.params.tasklistid;
        console.log('Adding new task list: ', task, taskListId);

        let taskList = findTaskListById(taskListId);
        // if we are updating task from one list to another list then we don't have to generate the id again.
        task._id = task._id || uuidv4();
        console.log('==== tasklist =>', taskList);
        taskList.tasks = taskList.tasks || [];
        taskList.tasks.push(task);

        console.log('creating tasks =>', taskList);
        // add new list item to db
        let result = db.tasksList.update({ _id: taskListId }, taskList, options);
        console.log('after update', result, taskList);
        console.log('from db ', findTaskListById(taskListId));
        // return updated list
        res.json(findTaskListById(taskListId));
    });

    /**
     * Api method to update the task
     */
    router.put("/tasks-list/:tasklistid/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskListId = req.params.tasklistid;
        const task = req.body;
        console.log("Editing item: ", taskId, " to be ", task);

        let tasks = filterTask(taskListId, taskId);
        tasks.push(task);
        let taskList = findTaskListById(taskListId);
        taskList.tasks = tasks;
        // add new list item to db
        db.tasksList.update({ _id: taskListId }, taskList, options);

        // return updated list
        res.json(findTaskListById(taskListId));
    });

    /**
     * Api method to delete task from a tasklist
     */
    router.delete("/tasks-list/:tasklistid/tasks/:id", (req, res) => {
        const taskId = req.params.id;
        const taskListId = req.params.tasklistid;
        console.log("Delete item with id: ", taskId);

        let taskList = findTaskListById(taskListId);
        taskList.tasks = filterTask(taskListId, taskId);
        // add new list item to db
        db.tasksList.update({ _id: taskListId }, taskList, options);

        // return updated list
        res.json(findTaskListById(taskListId));
    });
};