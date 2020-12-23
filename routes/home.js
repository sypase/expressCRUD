const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.render('index', { title: 'MyExpressApp', message: 'Hello' });
});
module.exports = router;
