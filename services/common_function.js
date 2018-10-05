const jwt = require("jsonwebtoken");

exports.login = login


function login(admin, condition, cb){
    // let token = req.headers.authorization.split(" ")[1] ? req.headers.authorization.split(" ")[1] : req.headers.authorization
    admin.auth().getUserByEmail(req.body.email)
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        let token = jwt.sign(userRecord.providerData[0].uid, 'Budged09@')
        cb(null, {"Successfully fetched user data" : userRecord.providerData, token: token});
    })
    .catch(function(error) {
        console.log("Error fetching user data:", error);
    });
}