const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
var express = require("express");
var app = express();

// package imports
const PORT = process.env.PORT || 50010;
const path = require("path")
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

// middlewares
app.use(morgan("dev"));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../dist/trueAge-admin')));
app.use(express.static(path.join(__dirname, './public')));
app.set('views', path.join(__dirname, '/../views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// routes
const admin = require("./routes/admin")

// init routes
app.use("/admin", admin)

app.listen(PORT, () =>{
    console.log(`Server started at PORT: ${PORT}`);
});

exports.api = functions.https.onRequest(app)