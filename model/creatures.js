const mongoose = require("mongoose");

const Creature = new mongoose.Schema({
    StateMachine: {
        type: Array,
        required: [true]
    },
    direction_change_time: {
        type:Number,
        required: [true]
    },
    health: {
        type: Number,
        required: [true],
        min: 1
    }, 
    name: {
        type: String,
        required: [true],
        minlength: 1,
        maxlength: 30
    },
    nr_of_states: {
        type: Number,
        required: [true]
    },
    speed: {
        type:Number,
        required: [true],
        min: 1
    },
    strength: {
        type: Number,
        required: [true]
    },
    power: {
        type: Number,
        required: [true]
    },
    transition_time: {
        type: Number,
        required: [true],
        min: 1
    },
    depth: {
        type: Number,
        required: [true],
        min: 0
    },

    owner: {
        type: String,
        required: [true],
        minlength: 1,
        maxlength: 30
    },
    kills: {
        type: Number,
        required: [true],
        min: 0
    },
    winratio: {
        type: Number,
        required: [true]
    },
    crystalls: {
        type: Number,
        required: [true],
        min: 0
    },
    crystall_countdown: {
        type: Number,
        required: [true],
    },
    badges: {
        type: Array,
        required: [true],
    },
    type: {
        type: String,
        required: [true],
        minlength: 1,
        maxlength: 30
    },
})

module.exports = mongoose.model("creatures", Creature)