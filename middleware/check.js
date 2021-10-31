const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        if(req.userData.role == "admin") {
            next();
        } else {
            next();
        }
        // next();
    } catch {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

// module.exports = (req,res,next) =>{

//     if(req.isAuthenticated() && req.user.role == "admin"){
//         next()
//     }else if(req.isAuthenticated() && req.user.role == "regular"){
//         next()
//     }else{
//         res.redirect('/')
//     }

// }