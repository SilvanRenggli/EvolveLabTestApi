const mongoose = require("mongoose");

const UserData = new mongoose.Schema({
    name: String,
    depth: Number,
    inFight: Boolean,
    alive: Array,
    money: Array,
    crystalls: Number,
    creatures: Array
})

module.exports = mongoose.model("userData", UserData)