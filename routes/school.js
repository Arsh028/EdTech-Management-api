const express = require('express');
const router = express.Router();

// @route POST /signup
// @des  Register a user
// @acess Public
router.get('/', (req, res) => {
  res.send('school route');
});

module.exports = router;
