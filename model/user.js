const mongoose = require("mongoose");

const Creature = new mongoose.Schema({
    StateMachine: Array,
    direction_change_time: Number,
    health: Number,
    name: String,
    nr_of_states: Number,
    speed: Number,
    strength: Number,
    power: Number,
    transition_time: Number,
    depth: Number,
    original_depth: Number,
    owner: String,
    kills: Number,
    winratio: Number 
})

const Users = new mongoose.Schema({
    Name: String,
    Score: Number
}) 

module.exports = mongoose.model("creatures", Creature);
module.exports = mongoose.model("users", Users);