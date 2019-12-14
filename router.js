const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  registerUser,
  loginUser,
} = require('./controllers/userController');

router.get('/', getDashboard);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;