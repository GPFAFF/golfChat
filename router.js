const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  registerUser,
  loginUser,
  logoutUser,
} = require('./controllers/userController');

router.get('/', getDashboard);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;