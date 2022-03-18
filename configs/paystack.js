const paystack = (request) => {
    const initializePayment = (form, callback) => {
        const options = {
            url: `https://api.paystack.co/transaction/initialize`,
            headers: {
                authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'cache-control': 'no-cache'
            },
            form
        }

        let callbackFn = (error, response, body) => {
            return callback(error, body)
        }
        request.post(options, callbackFn)
    }

    const verifyPayment = (ref, callback) => {
        const options = {
            url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
            headers: {
                authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'cache-control': 'no-cache'
            }
        }

        const callbackFn = (error, response, body) => {
            return callback(error, body)
        }
        request(options, callbackFn)
    }

    return { initializePayment, verifyPayment }
}

module.exports = paystack;
