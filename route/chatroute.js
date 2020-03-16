const express = require("express");
// const bodyParser = require("body-parser");
const connectdb = require("../dbconnect");
const chats = require("../models/chat");

const router = express.Router();

router.route("/").get((req, res, next) => {
    // res.setHeader("Content-Type", "application/json");
    // res.statusCode = 200;
var abc = '1'
    connectdb.then((abc) => {
        chats.find({}).then(chat => {
            console.log('chat ', chat);
            res.json(chat);
        });

    })
    
});

module.exports = router;
