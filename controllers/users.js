const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const request = require("request");
const { response } = require("express");
const Subaccount = require("../models/Subaccount");
const { createSubaccount } = require("../configs/paystack")(request);

module.exports = {
  register: async (req, res, next) => {
    await User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Email already exists!",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err.message,
              });
            } else {
              const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  // console.log(result);
                  res.status(201).json({
                    message: "User created successfully",
                    result,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },

  registerLL: (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Email already exists!",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err.message,
              });
            } else {
              const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: "landlord",
              });
              user
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json({
                    message: "User(Landlord) created successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },

  createSubaccount: (req, res, next) => {
    if(req.user.role !== "landlord") {
      return res.status(401).json({
        message: "Unauthorized to access this resource"
      })
    }

    try {
      const { business_name, settlement_bank, account_number } = req.body;
      const landlord = req.user.id

      const form = { 
        business_name,
        settlement_bank,
        account_number,
        percentage_charge: 10.0,
        description: "Subaccount for landlord with property on instarealty. To receive payment when a rental is made to property."
      }

      return createSubaccount(form, async(error, body) => {

        if(error) {
          console.log(error);
          return res.status(400).json({ error: "Error while creating subaccount" })
        }

        response = JSON.parse(body);
        console.log(response.data);
        const data = response.data;

        const subaccount = new Subaccount({
          business_name: data.business_name,
          subaccount_code: data.subaccount_code,
          percentage_charge: data.percentage_charge,
          account_number: data.account_number,
          settlement_bank: data.settlement_bank,
          description: data.description,
          owner: landlord
        })
        subaccount.save()

        return res.status(201).json({
          subaccount_code: data.subaccount_code,
          business_name: data.business_name,
          account_number: data.account_number,
          description: data.description,
          percentage_charge: data.percentage_charge,
        })

      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({error})
    } 
  },

  getUsers: (req, res, next) => {
    User.find({ role: "regular" })
      .then((docs) => {
        const response = {
          count: docs.length,
          users: docs,
        };
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: err.message,
        });
      });
  },

  login: (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed, no user found",
          });
        }
        console.log(user);
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            console.log("THIS FUCKING ERROR", err)
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                name: user[0].name,
                id: user[0]._id,
                role: user[0].role,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1d",
              }
            );
            const role = jwt.verify(token, process.env.JWT_KEY);
            return res.status(200).json({
              message: "Auth successful",
              role: role.role,
              token: token,
              name: user[0].name,
	      id: user[0]._id
            });
          } else {
            res.status(401).json({
              message: "Auth failed",
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  },
};
