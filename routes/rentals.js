var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { getRentals, createRental, edit_rental, delete_rental } = require('../controllers/rentals');
const upload = require('../configs/multer')

router.get('/', getRentals);

router.post('/', auth, upload.single('propertyPhotos'), createRental)

router.patch("/edit/:rentalId", auth, edit_rental);

router.delete("/delete/:rentalId", auth, delete_rental);



module.exports = router;
