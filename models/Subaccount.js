const mongoose = require("mongoose");

const subaccountSchema = mongoose.Schema({
    subaccount_code: {
        type: String,
        required: false
    },
    business_name: {
        type: String,
        required: false
    },
    account_number: {
        type: String,
        required: false
    },
    settlement_bank: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    percentage_charge: {
        type: Number,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }
})

const Subaccount = mongoose.model("Subaccount", subaccountSchema);
module.exports = Subaccount;
