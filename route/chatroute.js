const express = require("express");
const bodyParser = require("body-parser");
const connectdb = require("../dbconnect");
const chats = require("../models/chat");

const router = express.Router();

router.route("/").get((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    connectdb.then(() => {
        chats.find({}).then(chat => {
            res.json(chat);
            console.log('chats = ' + res);
        });
        
    })
});

module.exports = router;
