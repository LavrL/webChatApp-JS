const express = require("express");
// const bodyParser = require("body-parser");
const connectdb = require("../dbconnect");
const chats = require("../models/chat");

const router = express.Router();
const chosenRoom = require("../index");

router.route("/").get((req, res, next) => {
    // res.setHeader("Content-Type", "application/json");
    // res.statusCode = 200;

    console.log('in router ...', chosenRoom);
    connectdb.then(() => {
        //console.log(req.app.get(room));
        chats.find({'room': chosenRoom.room}).then(chat => {
            //console.log('chat ', chat);
            res.json(chat);
        });

    })

});

module.exports = router;
