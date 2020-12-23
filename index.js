const starupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const Joi = require('joi');
const config = require('config');
const logger = require('./middleware/logger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); //default
//////////////////////
console.log('Application name ' + config.get('name'));
console.log('Mail server name ' + config.get('mail.host'));
console.log('Mail server pass ' + config.get('mail.password'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  starupDebugger('Morgan Enabeled');
}
dbDebugger('connected to database');
//////////////////
app.use(logger);
app.use((req, res, next) => {
  console.log('Authutenting');
  next();
});

//////////////////////////////////////////////
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
