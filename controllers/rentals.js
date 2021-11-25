const mongoose = require("mongoose");
const User = require("../models/User");
const Rental = require("../models/Rental");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../configs/cloudinary");

module.exports = {
  getRentals: (req, res, next) => {
    Rental.find().then(result => res.status(200).json({
      data: result
    })).catch(error => {
      res.status(404).json({
        message: error.message
      })
    })
  },

  getRental: async (req, res, next) => {
    const id = req.params.id;
    Rental.findById(id)
    .then(rental => {
      if(!rental) {
        res.status(404).json({
          message: "No rental found for that id"
        })
      } else {
        res.status(200).json({
          message: "Rental found",
          data: rental
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `${err.message}`
      })
    })
  },

  // create rentals
  //============== create rentals=============
  createRental: async (req, res, next) => {
    let propertyPhotos;
    if (req.file) {
      // console.log("this is file======>", req.file);
      await cloudinaryConfig;
      const uploading = await cloudinary.uploader.upload(req.file.path);
      //   console.log(uploading);
      propertyPhotos = uploading.secure_url;
    }
    const rental = new Rental({
      propertyType: req.body.propertyType,
      address: req.body.address,
      roomNumber: req.body.roomNumber,
      assets: req.body.assets,
      price: req.body.price,
      propertyPhotos,
      landlord: req.user.id,
    });

    if (!rental)
      return res
        .status(500)
        .json({ success: false, msg: "error in creating rental" });

    rental.save().then((rental) =>
      res.status(201).json({
        success: true,
        rental,
      })
    );
  },

  //==============update rentals=======================
  edit_rental: async (req, res) => {
    let rentalId = req.params.rentalId;
    // console.log("ID========>", rentalId);
    await Rental.findById(rentalId).then(async (rental) => {
      if (!rental)
        return res.status(404).json({ msg: "No rental with this ID" });
      else if (rental.landlord.toString() !== req.user.id) {
        res.status(400).json({ msg: "Can not edit rental, not yours" });
      } else {
        // console.log("RENTAL========>", rental);
        let editedRental = req.body;
        // console.log("EDITED CONTENT==========>", editedRental);
        await Rental.findByIdAndUpdate(rentalId, editedRental, {
          returnOriginal: false,
        }).then((edits) => {
          if (edits) {
            res.status(201).json({
              success: true,
              msg: "edited sucessfully",
              edits,
            });
          } else {
            res.status(500).json({ msg: "rental edit failed" });
          }
        });
      }
    });
  },

  //====================delete rental======================
  delete_rental: async (req, res) => {
    const id = req.params.rentalId;
    Rental.findById(id).then((rental) => {
      if (!rental)
        return res.status(404).json({ msg: "No rental with this ID" });
      else if (rental.landlord.toString() !== req.user.id) {
        res.status(400).json({ msg: "Can not delete rental, not yours" });
      } else {
        Rental.findByIdAndDelete(id, { returnOriginal: false }).then(
          (rental) => {
            if (!rental)
              return res.status(500).json({ msg: "deletion failed" });
            else {
              res.status(200).json({
                success: true,
                msg: "deletion successfull",
                rental,
              });
            }
          }
        );
      }
    });
  },

  //================rental review and rating=================
  review_rental: async (req, res) => {
    const { rating, comment } = req.body;
    const rental = await Rental.findById(req.params.rentalId);
    if (
      rental.reviews.filter(
        (rev) => rev.user.toString() === req.user.id.toString()
      ).length > 0
    ) {
      res.status(400).json({ msg: "Rental already reviewed" });
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user.id,
      };
      rental.reviews.push(review); //push new review into rental reviews array
      rental.numReviews = rental.reviews.length; //set total number of reviews(numReviews) to length of reviews array
      rental.ratings =
        rental.reviews.reduce(
          (acc, currentItem) => currentItem.rating + acc,
          0
        ) / rental.reviews.length; //set rental ratings to sum of review.rating in reviews array divide by total number of reviews
      await rental.save();
      res.status(201).json({
        msg: "Review added",
        rental,
      });
    }
  },
};
