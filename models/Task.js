const fs =require('fs');
const path = require('path');
const uuid = require('uuid');
const _  = require('lodash');
const moment = require('moment');

const filename = path.join(__dirname, '../data/tasks.json');

exports.getAll = function(cb) {
  fs.readFile(filename, (err, buffer)  => {
    if (err) return cb(err);
    try {
      var data = JSON.parse(buffer);
    } catch(e) {
      var data = [];
    }

    cb(null, data);
  })
}

exports.write = function(newData, cb) {
  let json = JSON.stringify(newData);
  fs.writeFile(filename, json, cb);
}


exports.create = function(newTask, cb) {
  exports.getAll((err, tasks) => {
    if (err) return cb(err);
    newTask.id = uuid();
    newTask.isComplete = 'false';
    tasks.push(newTask);
    exports.write(tasks, cb);
  });
}

exports.delete = function(req, cb){
  exports.getAll((err, tasks) => {
    let deleteTask = req.params.id;
    let newtasks = tasks.filter(task => {
       let state = task.isComplete;
      if (deleteTask === "complete") {
        if (state !== "true")
        return task
      } else if (deleteTask !== task.id) {
        return task;
      }
    })
    exports.write(newtasks, cb)
  })
}

exports.update = function(req, cb) {
  exports.getAll((err, tasks) => {
    let taskId = req.params.id;
    let updatedtasks = tasks.map(task => {
      if(taskId === task.id) {
        task.isComplete === "false" ? task.isComplete = "true" : task.isComplete = "false"
      }
      return task
    })
    exports.write(updatedtasks, cb);

    cb(null, updatedtasks)
  })
}

exports.filterIsComplete = function(req, cb) {
  exports.getAll((err, tasks)  => {
    if(err) return cb(err);
    let booleanState = req.query.complete;
    let completeState = tasks.filter(task => {
        let state = task.isComplete;
          if (state === booleanState) {
          return task
      } else if (!booleanState) {
        return task;
      }
    })
    
        cb(null, completeState)
 
  })// end of getALl
}








