// import { post } from 'got';
const axios = require('axios');

async function initializePayment(data) {
    let config = {
        headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
        }
    }
    try {
        const response = await axios.post(`${process.env.FLW_BASE_URL}payments`, data, config)

        console.log("FROM INITIALIZE FUNCTION",response.data);
        return response.data;
    } catch (error) {
        console.log("FROM INIT FUNC CATCH",error);
        return error
    }
}

// async function initializePayment(data) {
//     try {
//         const response = await post(`${process.env.FLW_BASE_URL}payments`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
//             },

//             json: data
//         }).json()

//         console.log(response);
//         return response;
//     } catch (error) {
//         console.log(error);
//         return error.message
//     }
// }

module.exports = initializePayment
