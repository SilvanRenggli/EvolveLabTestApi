const mongoose = require("mongoose");

const UserData = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true],
        maxlength: 30,
        minlength: 1
    },
    depth: {
        type: Number,
        required: [true]
    },
    inFight: {
        type: Boolean,
        required: [true]
    },
    alive: {
        type: Array,
        required: [true]
    },
    money: {
        type: Array,
        required: [true]
    },
    crystals: {
        type: Number,
        required: [true]
    },
    creatures:{ 
        type: Array,
        required: [true]
    }
})

module.exports = mongoose.model("userData", UserData)