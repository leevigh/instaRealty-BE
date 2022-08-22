const mongoose = require("mongoose");

const subaccountSchema = mongoose.Schema({
    sid: { //subaccount object id, different from the id of this schema
        type: String,
        required: false,
    },
    account_number: {
        type: String,
        required: false
    },
    account_bank: {
        type: String,
        required: false
    },
    full_name: {
        type: String,
        required: false
    },
    subaccount_id: {
        type: String,
        required: false
    },
    bank_name: {
        type: String,
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
