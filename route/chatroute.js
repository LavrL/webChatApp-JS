const express = require("express");
const connectdb = require("../dbconnect");
const chats = require("../models/chat");
const router = express.Router();
const chosenRoom = require("../index");

router.route("/").get((req, res, next) => {
    connectdb.then(() => {
        chats.find({ 'room': chosenRoom.room }).then(chat => {
            res.json(chat);
        });
    })
});

module.exports = router;
