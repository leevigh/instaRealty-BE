const mongoose = require("mongoose");
const User = require("../models/User");
const Rental = require("../models/Rental");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const exiftool = require("exiftool-vendored").exiftool;
const OpenLocationCode = require('open-location-code').OpenLocationCode
const cloudinary = require("cloudinary").v2;
const { cloudinaryConfig } = require("../configs/cloudinary");
const request = require('request');
// const { initializePayment, verifyPayment } = require('../configs/paystack')(request)
const getSubaccount = require('../helpers/getSubaccount')
const initializePayment = require('../configs/flutterwave')

const Flutterwave = require('flutterwave-node-v3')

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const handleError = (err, res) => {
  res.status(500).contentType('text/plain').end('Oops! Something went wrong')
}

module.exports = {
  getRentals: async (req, res, next) => {
    await Rental.find().then(result => res.status(200).json({
      success: true,
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

  //Displays rental a user has paid for in their profile page
  getRentedProperty: async (req, res, next) => {
    const userId = req.user.id;

    if(req.user.role === 'landlord') {
      res.status(405).json({
        success: false,
        message: "You are not authorized to access this resource"
      })
    }


    try {
      Rental.find({occupant: userId, isAvailable: false})
      .then(rental => {
        res.status(200).json({
          success: true,
          data: rental
        })
      })
      .catch(error => {
        console.log("Get rented property error",error) // development
        res.status(404).json({
          success: false,
          message: "There was an error while finding rentals",
          error: error
        })
      })
    } catch (error) {
      console.log("HERE!!");
      console.log("catch block error>>", error)
    }
    
  },

  //Display owner's rental in dashboard
  getOwnerProperty: async (req, res) => {
    const ownerId = req.user.id;

    if(req.user.role === 'landlord') {
      Rental.find({ landlord: ownerId })
      .then(rental => {
        res.status(200).json({
          success: true,
          data: rental
        })
      })
      .catch(error => {
        console.log("Error getting owner rental>", error) // development
        res.status(404).json({
          success: false,
          message: "There was an error finding your rentals",
          error: error
        })
      })
    }
  },

  // create rentals
  //============== create rentals=============
  createRental: async (req, res, next) => {
    let propertyPhotos;
    let imageData;
    let code;
    let photoURIs = [];
    const cloudinary_secure_urls = []; // array to hold the secure url from cloudinary after uploading

    // console.log("FILESSS", req.files)

    if(req.user.role !== "landlord") return res.status(403).json({message: "Unauthorized user"})
    
    if (req.files) {
      console.log("this is file======>", req.files);

      const exif = async () => {
        console.log(await exiftool.version())
      }

      // exiftool
      // .read(req.file.path)
      // .then(tags => console.log(tags))

      imageData = await exiftool.read(req.files[0].path) // only read the exif data of the first item

      //exporting the coordinates to be used later to get address string
      module.exports = {photoGPS: imageData && imageData.GPSPosition ? imageData.GPSPosition : null}

      if(imageData && imageData.GPSPosition) {
        console.log(imageData.GPSPosition);
        console.log(typeof imageData.GPSPosition);
        const latlng = imageData.GPSPosition.split(" ")
        console.log(latlng)
        const openLocationCode = new OpenLocationCode()
        code = openLocationCode.encode(parseFloat(latlng[0]), parseFloat(latlng[1]))
  
        //loop through the array of file uploads and store the path in an array to send to cloudinary
        const files = req.files
        for(const file of files) {
          const { path } = file;
          photoURIs.push(path)

          const secure_url = await cloudinary.uploader.upload(path)
          // const uploading = await cloudinary.uploader.upload(uri)
          cloudinary_secure_urls.push(secure_url.secure_url)
        }


        await cloudinaryConfig;
// LEAVING THESE COMMENTS IN TO REMIND ME OF MISTAKE
        // photoURIs.forEach(async uri => {
        //   console.log("URIs>>", uri);

        //     const uploading = await cloudinary.uploader.upload(uri)
        //     .then(async photo => {
        //       console.log("FROM CLOUD.", photo);
        //       cloudinary_secure_urls.push(photo.secure_url)
        //     })
        //     .catch(error => {
        //       console.error("THIS ERROR",error)
        //     });
        //   // cloudinary_secure_urls.push(uploading.secure_url)
        // })
        // const uploading = await cloudinary.uploader.upload(photoURIs);
          // console.log(cloudinary_secure_urls);
        // propertyPhotos = uploading.secure_url;
        console.log(cloudinary_secure_urls);
      } else {
        //code 406 - Not acceptable
        return res.status(406).json({
          message: "Photo has no GPS data. Switch on GPS in camera."
        })
      }
    }


    //if only one image uploaded
    if(req.file && req.file.path) {

      imageData = await exiftool.read(req.file.path)
  
       //exporting the coordinates to be used later to get address string
        module.exports = {photoGPS: imageData && imageData.GPSPosition ? imageData.GPSPosition : null}

        if(imageData && imageData.GPSPosition) {
          console.log(imageData.GPSPosition);
          console.log(typeof imageData.GPSPosition);
          const latlng = imageData.GPSPosition.split(" ")
          console.log(latlng)
          const openLocationCode = new OpenLocationCode()
          code = openLocationCode.encode(parseFloat(latlng[0]), parseFloat(latlng[1]))

          await cloudinaryConfig;
          const uploading = await cloudinary.uploader.upload(req.file.path);
          propertyPhotos = uploading.secure_url;
        }

    }

    console.log(imageData.GPSPosition)

      const rental = new Rental({
        propertyType: req.body.propertyType,
        address: req.body.address,
        postalCode: req.body.postalCode,
        city: req.body.city,
        description: req.body.description,
        roomNumber: req.body.roomNumber,
        assets: req.body.assets,
        price: req.body.price,
        propertyPhotos: cloudinary_secure_urls,
        coordinates: imageData.GPSPosition,
        pluscode: code,
        landlord: req.user.id,
      });
    
    if (!rental)
      return res
        .status(500)
        .json({ success: false, msg: "error in creating rental" });

    rental.save()
    .then((rental) =>
      res.status(201).json({
        success: true,
        rental,
      })
    ).catch(error => {
      console.error("Error creating rental >>", error)
      res.status(500).json({
        error: error
      })
    });
    
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
    const rental = await Rental.findById(req.params.id);
    if (
      rental.reviews.filter(
        (rev) => rev.user.toString() === req.user.id.toString()
      ).length > 0
    ) {
      res.status(400).json({ msg: "Rental already reviewed" });
    } else {
      const review = {
        name: req.user.name,
        rating: rating,
        comment,
        user: req.user.id,
      };
      rental.reviews.push(review); //push new review into rental reviews array
      rental.numReviews = rental.reviews.length; //set total number of reviews(numReviews) to length of reviews array
      rental.ratings = rental.reviews.reduce((acc, currentItem) => currentItem.rating + acc,0) / rental.reviews.length; //set rental ratings to sum of review.rating in reviews array divide by total number of reviews
      await rental.save();
      res.status(201).json({
        msg: "Review added"
      });
    }
  },

  paymentInfo: async (req, res) => {
    const rentalId = req.params.id; // id of the rental to be paid for
    let tx_ref = `instarealty-${req.params.id}`;

    try {
      const { amount } = req.body;
      const { email, name, phonenumber } = req.body;
      // const form = { email, amount, name }
      let subaccount_id = getSubaccount(rentalId) // subaccount of the owner of the rental to split payment with

      const details = {
        tx_ref,
        amount,
        redirect_url: `${process.env.DEVELOPMENT_URL}api/v1/rentals/verify/${rentalId}`,
        currency: "NGN",
        customer: {
          email,
          name,
          phonenumber
        },
        subaccounts: [
          {
            id: subaccount_id
          }
        ]
      }

      initializePayment(details)
      .then(response => {
        res.status(200).json({
          status: response.status,
          payment_url: response.data.link
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: err
        })
      })

      // res.status(200).json({
      //   status: initializePayment(details).status,
      //   payment_url: initializePayment(details).link
      // })

      // return initializePayment(form, (error, body) => {
      //   if(error) {
      //     console.log("Error >>>", error);
      //     return res.status(400).json({ error: `Payment initialization error`})
      //   }

      //   response = JSON.parse(body);
      //   console.log("RESPONSE!!! ",response);

      //   return res.json({
      //     payment_redirect_url: response.data.authorization_url,
      //     payment_reference_id: response.data.reference
      //   })
      // })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        error
      })
    }
  },

  verifyPayment: async (req, res) => {
    const rentalId = req.params.id;
    const transaction_id = req.query.transaction_id;
    const status = req.query.status;
    const userId = req.user.id;

    if(status === "successful") {
      const rental = await Rental.findById(rentalId)
      const response = await flw.Transaction.verify({id: transaction_id})

      if(
        response.data.status === "successful" &&
        response.data.amount === rental.price &&
        response.data.currency === "NGN"
      ) {
          await Rental.findByIdAndUpdate({_id: rentalId}, {
            isAvailable: false,
            occupant: userId
          })

          return res.status(201).json({
            message: "Payment Verified and Rental assigned"
          })
      } else {
        return res.status(500).json({
          message: "Payment Verification Failed"
        })
      }
    }

    // try {
    //   return verifyPayment(ref, async(error, body) => {
    //     if(error) {
    //       console.log(error);
    //       return res.status(400).json({ error: "Error while verifying payment" })
    //     }

    //     response = JSON.parse(body);
    //     console.log(response.data);
    //     const { reference, amount, channel, currency, paid_at } = response.data;

    //   })
    // } catch (error) {
    //   console.log(error)
    //   return res.status(500).json({error})
    // }
  }
};
