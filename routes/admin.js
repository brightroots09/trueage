const express = require("express");
const router = express.Router();

const async = require("async");
const _ = require("underscore");
const jwt = require("jsonwebtoken");
const commonFunction = require("../services/common_function")

const admin = require('firebase-admin');
// service account key -> firebase
const serviceAccount = require('../serviceAccountKey.json');
// initializing firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://trueage-2018.firebaseio.com'
});

// firebase database
const db = admin.database()
const ref = db.ref("/");
let uid = null;

// verify access token
function verifyToken(req, res, callback) {
    if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized Request")
    }
    else {
        let token = req.headers.authorization.split(" ")[1] ? req.headers.authorization.split(" ")[1] : req.headers.authorization
        if (token === 'null') {
            return res.status(401).send("Unauthorized Request")
        }
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                uid = decodedToken.uid;
                if (!uid) {
                    return res.status(401).send("Unauthorized Request")
                }
                req.userId = uid;
                callback()
            }).catch(function (error) {
                console.log(error)
            });
    }
}

router.get("/profile", verifyToken, function (req, res, callback) {
    admin.auth().getUser(uid)
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            res.json({
                data: userRecord.providerData,
                details: { verified: userRecord.emailVerified, disabled: userRecord.disabled }
            })
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
        });
});

router.post("/create_coupon", verifyToken, function (req, res, callback) {
    let coupons = db.ref("/coupon_codes").child(req.body.code);

    coupons.set({
        used_by: 0,
        user_limit: req.body.number,
        vote_credits: req.body.credits
    });

    res.json("coupon inserted")

})

router.get("/view_coupons", verifyToken, function (req, res, callback) {
    let coupons = db.ref("/coupon_codes");

    coupons.once("value", function (snapshot) {
        let data = []
        snapshot.forEach(element => {
            data.push({ key: element.key, data: element.val() })
        })
        res.json(data)
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

})

router.get("/coupon_detials/:id", verifyToken, function (req, res, callback) {
    let coupons = db.ref(`/coupon_codes/${req.params.id}`)

    coupons.once("value", function (snapshot) {
        let data = []
        snapshot.forEach(element => {
            data.push({ key: element.key, data: element.val() })
        })
        res.json(data)
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

})

router.post("/edit_coupon/:id", verifyToken, function (req, res, callback) {
    let coupons = db.ref(`coupon_codes/${req.params.id}`)
    coupons.set({
        used_by: req.body[0].data,
        vote_credits: req.body[2].data,
        user_limit: req.body[1].data
    });
    res.json("coupon edited")
})

// router.post("/voting_list", function(req, res, callback){
//     let images = db.ref(`voting_list`)
//     let id = req.body.id
//     images.push().set({
//         image_id: 'abc',
//         user_id: 1233456
//     });
//     res.json("Done")
// })

// router.post("/user_profile_photos", function(req, res, callback){
//     let images = db.ref(`user_profile_photos`)
//     let id = req.body.id
//     images.child(101010101).set({
//         abcdef: {
//             current_collected_votes: req.body.current_votes,
//             image_url: req.body.image_url,
//             total_votes: req.body.total_votes,
//             votes_to_be_collected: req.body.votes_to_be_collected
//         }
//     });
//     res.json("Done")
// })

router.get("/view_images", verifyToken, function (req, res, callback) {
    let voting_list_db = db.ref('voting_list');
    let images = db.ref(`user_profile_photos`)

    voting_list_db.once('value', function (snapshot) {
        var promises = [];
        snapshot.forEach(function (childSnapshot) {

            var childKey = childSnapshot.key;
            var fk = snapshot.child(childKey).val();

            var promise = images.child(childSnapshot.val().user_id).once('value');

            promises.push(promise);
        });

        Promise.all(promises).then(function (snapshots) {
            var dataSet = [];
            snapshots.forEach(function (result) {

                // var childData =  _.assign(result.key, result.val());
                dataSet.push({
                    key: result.key,
                    childKey: Object.keys(result.val()),
                    childData: result.val()
                });

            });
            res.json(dataSet);
        });

    });
})

router.post("/delete_image", verifyToken, function (req, res, callback) {
    let images = db.ref(`voting_list`)
    
    let user_id = req.body.image.key;
    let image_id = req.body.id
    let reason = req.body.reason.reason;
    let image_url = req.body.url
    
    let user_profile_photo = db.ref(`user_profile_photos`).child(user_id).child(image_id)
    let notification = db.ref(`notification_list`).child(user_id)

    console.log(image_id)

    images.orderByChild('image_id').equalTo(image_id)
        .once('value').then(function (snapshot) {
            console.log(snapshot.val())
            snapshot.forEach(function (childSnapshot) {
                //remove each child
                images.child(childSnapshot.key).remove();
            });
        })

    // notification.push().set({
    //     image_link: image_url,
    //     message: reason,
    //     type: "delete_image_done"
    // })

    // user_profile_photo.once('value', function(snapshot){
    //     user_profile_photo.set({
    //         current_collected_votes: '0',
    //         image_url: snapshot.val().image_url,
    //         total_collected_votes: snapshot.val().total_collected_votes,
    //         votes_to_be_collected: '0'
    //     })
    // })

    res.json("Image Deted")

})


module.exports = router;