var express = require("express");
var router = express.Router();
const cors = require('cors');
const auth = require('../middleware/auth');
const { 
    getRentals, 
    getRentedProperty,
    getOwnerProperty,
    getRental, 
    createRental, 
    edit_rental, 
    delete_rental, 
    review_rental, 
    paymentInfo, 
    verifyPayment } = require('../controllers/rentals');
const upload = require('../configs/multer');

router.get('/', getRentals);

router.get('/rental/:id', getRental);

router.get('/rented-property', auth, getRentedProperty);

router.get('/owner-properties', auth, getOwnerProperty);

router.post('/', auth, upload.any('propertyPhotos',6), createRental)

router.patch("/edit/:rentalId", auth, edit_rental);

router.post("/:id/review", auth, review_rental);

router.delete("/delete/:rentalId", auth, delete_rental);

router.post("/initialize/:id", auth, paymentInfo)

router.get("/verify/:id", auth, verifyPayment);

module.exports = router;
