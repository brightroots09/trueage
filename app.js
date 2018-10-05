var express = require("express");
var app = express();

// package imports
const PORT = process.env.PORT || 8080;
const path = require("path")
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

// middlewares
app.use(morgan("dev"));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist/trueAge-admin')));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// routes
const admin = require("./routes/admin")

// init routes
app.use("/admin", admin)

app.listen(PORT, function(){
    console.log(`Server started at PORT: ${PORT}`);
});