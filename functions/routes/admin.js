const express = require("express");
const router = express.Router();

const async = require("async");
const _ = require("underscore");
const jwt = require("jsonwebtoken");
// const commonFunction = require("../services/common_function")
const moment = require("moment");
const cron = require("node-schedule");

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
			.then((decodedToken) => {
				uid = decodedToken.uid;
				if (!uid) {
					return res.status(401).send("Unauthorized Request")
				}
				req.userId = uid;
				callback()
				return req.userId
			}).catch((error) => {
				console.log(error)
				return error
			});
	}
}

// Cron Job

// (function cronJob() {
//     let registered_user = db.ref('registered-users')

//     registered_user.once('value')
//         .then(function (snapshot) {
//             snapshot.forEach(element => {
//                 registered_user.child(element.key).once("value")
//                     .then(function (childSnapshot) {
//                         var purchased_plan = childSnapshot.val().purchased_plan ? childSnapshot.val().purchased_plan : ""
//                         var rule = new cron.RecurrenceRule();
//                         rule.second = 1;
//                         cron.scheduleJob(rule, function () {
//                             console.log(purchased_plan)
//                         });

//                     })
//             })
//         })
// })()



// Admin Profile
router.get("/profile", verifyToken, (req, res, callback) => {
	admin.auth().getUser(uid)
		.then((userRecord) => {
			// See the UserRecord reference doc for the contents of userRecord.
			return res.json({
				data: userRecord.providerData,
				details: { verified: userRecord.emailVerified, disabled: userRecord.disabled }
			})
		})
		.catch((error) => {
			console.log("Error fetching user data:", error);
			return error
		});
});


// Route to create coupons
router.post("/create_coupon", verifyToken, (req, res, callback) => {
	let coupons = db.ref("/coupon_codes").child(req.body.code);

	coupons.set({
		used_by: 0,
		user_limit: req.body.number,
		vote_credits: req.body.credits
	});

	res.json("coupon inserted")

})


// Route to view all coupons
router.get("/view_coupons", verifyToken, (req, res, callback) => {
	let coupons = db.ref("/coupon_codes");

	coupons.once("value", (snapshot) => {
		let data = []
		snapshot.forEach(element => {
			data.push({ key: element.key, data: element.val() })
		})
		res.json(data)
	}, (errorObject) => {
		console.log("The read failed: " + errorObject.code);
	});

})


// route to view a particular coupon's details
router.get("/coupon_detials/:id", verifyToken, (req, res, callback) => {
	let coupons = db.ref(`/coupon_codes/${req.params.id}`)

	coupons.once("value", (snapshot) => {
		let data = []
		snapshot.forEach(element => {
			data.push({ key: element.key, data: element.val() })
		})
		res.json(data)
	}, (errorObject) => {
		console.log("The read failed: " + errorObject.code);
	});

})


// Route to edit Coupon
router.post("/edit_coupon/:id", verifyToken, (req, res, callback) => {
	let coupons = db.ref(`coupon_codes/${req.params.id}`)
	coupons.set({
		used_by: req.body[0].data,
		vote_credits: req.body[2].data,
		user_limit: req.body[1].data
	});
	res.json("coupon edited")
})


// Route to view images in voting list
router.get("/view_images", verifyToken, (req, res, callback) => {
	let voting_list_db = db.ref('voting_list');
	let images = db.ref(`user_profile_photos`)

	voting_list_db.once('value', (snapshot) => {
		var promises = [];
		snapshot.forEach((childSnapshot) => {

			var childKey = childSnapshot.key;
			var fk = snapshot.child(childKey).val();

			var promise = images.child(childSnapshot.val().user_id).child(childSnapshot.val().image_id).once('value');
			promises.push(promise);
		});

		Promise.all(promises)
			.then((snapshots) => {
				var dataSet = [];
				snapshots.forEach((result) => {

					// var childData =  _.assign(result.key, result.val());
					if (result.val() !== undefined) {
						dataSet.push({
							key: result.key,
							childKey: Object.keys(result.val()),
							childData: result.val()
						});
					}

				});
				return res.json(dataSet);
			})
			.catch(error => {
				console.log(error)
				return error
			})
	});
})


// route to delete particular image from voting list
router.post("/delete_image", verifyToken, (req, res, callback) => {
	let images = db.ref(`voting_list`)

	// let user_id = req.body.id.key;
	let image_id = req.body.id;
	let reason = req.body.reason.reason;
	let image_url = req.body.url

	let user_profile_photo = db.ref(`user_profile_photos`)
	let notification = db.ref(`notification_list`);

	let registered_user = db.ref('registered-users')
	var payload = {
		notification: {
			title: "Image Deleted",
			body: "The image was deleted by moderator."
		}
	};

	var options = {
		priority: "high",
		timeToLive: 60 * 60 * 24
	};

	let date = new Date();


	images.orderByChild('image_id').equalTo(image_id)
		.once('value')
		.then((snapshot) => {
			snapshot.forEach((childSnapshot) => {
				//remove each child
				images.child(childSnapshot.key).remove();

				registered_user.child(childSnapshot.val().user_id).once('value')
					.then((result) => {
						if (result.val().enable_notification === '1') {
							admin.messaging().sendToDevice(result.val().fcm_token, payload, options)
								.then((response) => {
									console.log("Successfully sent message:", response);
									return response
								})
								.catch((error) => {
									console.log("Error sending message:", error);
									return error
								});
						}
						return 1
					})
					.catch(error => {
						console.log(error)
						return error
					})

				notification.child(childSnapshot.val().user_id).push().set({
					date: moment(date).format('DD-MM-YYYY, HH:mm A'),
					image_link: image_url,
					message: reason,
					type: "delete_image_done"
				})

				user_profile_photo.child(childSnapshot.val().user_id).child(image_id).once('value', (snapshot) => {
					user_profile_photo.child(childSnapshot.val().user_id).child(image_id).set({
						current_collected_votes: "0",
						image_url: snapshot.val().image_url,
						total_collected_votes: snapshot.val().total_collected_votes,
						votes_to_be_collected: "0"
					})
				})
			});
			return 1
		})
		.catch(error => {
			console.log(error)
			return error
		})

	res.json("Image Deted")

})

// route to view all the images that are reported
router.get("/reports", verifyToken, (req, res, callback) => {
	let reports = db.ref('report_list');
	let images = db.ref(`user_profile_photos`)

	reports.once('value', (snapshot) => {
		var promises = [];
		snapshot.forEach((childSnapshot) => {

			var childKey = childSnapshot.key;
			var fk = snapshot.child(childKey).val();

			var promise = images.child(childSnapshot.val().user_id).child(childSnapshot.val().image_id).once('value');
			promises.push(promise);
		});

		Promise.all(promises)
			.then((snapshots) => {
				var dataSet = [];
				snapshots.forEach((result) => {

					// var childData =  _.assign(result.key, result.val());
					if (result.val() !== undefined) {
						dataSet.push({
							key: result.key,
							childKey: Object.keys(result.val()),
							childData: result.val()
						});
					}

				});
				return res.json(dataSet);
			})
			.catch(error => {
				console.log(error)
				return error
			})

	});
})

// route to delete reported image
router.post("/delete_reported_image", verifyToken, (req, res, callback) => {
	let reports = db.ref('report_list');
	let voting_list = db.ref('voting_list');
	let registered_user = db.ref('registered-users')
	let image_id = req.body.key

	var payload = {
		notification: {
			title: "Image Deleted",
			body: "The image was deleted by moderator."
		}
	};

	var options = {
		priority: "high",
		timeToLive: 60 * 60 * 24
	};

	reports.orderByChild('image_id').equalTo(image_id).once('value')
		.then((snapshot) => {
			snapshot.forEach(childSnapshot => {
				// console.log(childSnapshot.key)

				registered_user.child(childSnapshot.val().user_id).once('value')
					.then((result) => {
						if (result.val().enable_notification === '1') {
							admin.messaging().sendToDevice(result.val().fcm_token, payload, options)
								.then((response) => {
									console.log("Successfully sent message:", response);
									return response
								})
								.catch((error) => {
									console.log("Error sending message:", error);
									return error
								});
						}
						return 1
					})
					.catch(error => {
            console.log(error)
						return error
					})
				user_profile_photo.child(childSnapshot.val().user_id).child(image_id).once('value', (snapshot) => {
					user_profile_photo.child(childSnapshot.val().user_id).child(image_id).set({
						current_collected_votes: "0",
						image_url: req.body.childData.image_url,
						total_collected_votes: req.body.childData.total_collected_votes,
						votes_to_be_collected: "0"
					})
				})

				reports.child(childSnapshot.key).remove();
			})
			return res.json("Image removed from feed")
		})
		.catch(error => {
			console.log(error)
			return error
		})
})

// route to add reported image to coting list
router.post("/add_to_voting_list", verifyToken, (req, res, callback) => {
	let reports = db.ref('report_list');
	let voting_list = db.ref('voting_list')
	let image_id = req.body.key


	reports.orderByChild('image_id').equalTo(image_id).once('value')
		.then((snapshot) => {
			snapshot.forEach(childSnapshot => {
				voting_list.push().set({
					image_id: req.body.key,
					user_id: childSnapshot.val().user_id,
					voted_user_data: childSnapshot.val().voted_user_data
				})
				reports.child(childSnapshot.key).remove();
			})
			return res.json("Image added to voting list")
		})
		.catch(error => {
			console.log(error)
			return error
		})
})

module.exports = router;