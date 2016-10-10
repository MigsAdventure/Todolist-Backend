const PORT = 8000;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const Task = require('./models/Task');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//ROUTES

app.get('/todos?', (req,res) => { 
  Task.filterIsComplete(req, (err,task) => {
    if (err) return res.status(400).send(err);   
    res.send(task);
  });
})

app.post('/todos', (req,res) => {
  Task.create(req.body, err => {
    if (err) return res.status(400).send(err);
    res.send(`new task was added: \n ${JSON.stringify(req.body)}`);
  })
});

app.delete('/todos/:id', (req, res) => {
  Task.delete(req,err => {
  if(err) return res.status(400).send(err);
 });
 res.send('deleted task');
}) 

app.put('/todos/:id', (req,res) => {
  Task.update(req, (err, updatedTask) => {
    if(err) return res.status(400).send(err);
    res.send(updatedTask)
  })
})

app.listen(PORT, err => {
  console.log(err || `Express listening on port ${PORT}`);
})

