const mongoose = require("mongoose");

const Token = new mongoose.Schema({
    token: String
})

module.exports = mongoose.model("tokens", Token)