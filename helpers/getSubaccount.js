const User = require("../models/User");
const Rental = require("../models/Rental");
const Subaccount = require("../models/Subaccount");

module.exports = function (rentalId) {
    try {
        Rental.findById(rentalId)
        .then(rental => {
            let landlord = rental.landlord;
            Subaccount.findOne({owner: landlord})
            .then(subaccount => {
                return subaccount.subaccount_id;
            })
        })
        .catch(error => {
            // console.log("BITCH ASS ERROR IN SUBACCOUNT FUNC",error);
            return {
                message: error.message
            }
        })

    } catch (error) {
        return {
            message: error.message
        }
    }
}

// module.exports = getSubaccount;
