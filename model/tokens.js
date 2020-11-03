const mongoose = require("mongoose");

const User = new mongoose.Schema({
    token: String
})

module.exports = mongoose.model("tokens", Token)