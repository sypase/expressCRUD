const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();
app.use(express.json());
app.use(logger);
app.use((req, res, next) => {
  console.log('Authutenting');
  next();
});
const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];
app.get('/', (req, res) => {
  res.send(`Hello wrld`);
});
app.get('/api/courses', (req, res) => {
  res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send('the course with hte given ID was not found'); //404
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    console.log('here');
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  //Look up the course
  //If not existing, return 404
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('the course with hte given ID was not found'); //404
  }

  //Validate
  //If invalid, return 400- Bad request
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //Update course
  course.name = req.body.name;
  res.send(course);
  //Return the updated course
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req, res) => {
  //Look Up the course
  //Not existing, return 404
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send('the course with hte given ID was not found'); //404
  }
  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //Return the same course
  res.send(course);
});

//////////////////////////////////////////////
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
