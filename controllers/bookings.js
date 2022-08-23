const Booking = require("../models/Booking")

module.exports = {
    getBookings: (req, res) => {
        Booking.find({ renter: req.user.id })
        .then(result => {
            res.status(200).json({
                data: result
            })
        })
        .catch(error => {
            res.status(404).json({
                message: error.message
            })
        })
    },

    addBooking: (req, res) => {
        const { rentalId } = req.params;

        const { date, time, phoneNumber, email, message } = req.body;

        if(req.user.role === "landlord") {
            return res.status(403).json({
                success: false,
                message: "A landlord user is unauthorized to access this resource"
            })
        }

        const booking = new Booking({
            date: date,
            time: date,
            phoneNumber: phoneNumber,
            email: email,
            message: message,
            rental: rentalId,
            renter: req.user.id
        })

        if(!booking) return res.status(500).json({ success: false, message: "Error creating booking" })

        booking.save()
        .then(() => {
            res.status(401).json({
                success: true,
                message: "Your booking of this rental has been saved"
            })
        })
        .catch(error => {
            console.log("Error", error); // development
            res.status(405).json({
                success: false,
                message: error.message
            })
        })
    },

    cancelBooking: (req, res) => {},
}