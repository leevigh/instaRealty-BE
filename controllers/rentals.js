const mongoose = require('mongoose');
const User = require('../models/User');
const Rental = require('../models/Rental');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    createRental: (req, res, next) => {
        const rental = new Rental({
            propertyType: req.body.propertyType,
            address: req.body.address,
            roomNumber: req.body.roomNumber,
            assets: req.body.assets,
            price: req.body.price,
            propertyPhotos: req.body.propertyPhotos,
            landlord: req.user
        })
    }
}
