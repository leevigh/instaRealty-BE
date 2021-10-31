var express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const {register, login, registerLL} = require('../controllers/users');
var router = express.Router();

/* GET users listing. */
// router.get('/', auth, function(req, res, next) {
//   User.find()
//   .then(data => {
//     res.status(200).json({users: data});
//   })
//   .catch(error => {
//     res.status(404).json({message: error})
//   });
// });

router.post('/register', register)
router.post('/landlord/register', registerLL)
router.post('/login', login)

module.exports = router;
