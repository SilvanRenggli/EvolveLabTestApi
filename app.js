const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("dotenv/config")

const app = express()
const Creature = require("./model/creatures")
const User = require("./model/user")
var PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/login', (req, res) => {
    //Authenticate User
})


app.post("/store_creature", async (req, res) => {
    //stores a new creature
});

app.post("/create_user", async (req, res) => {
    //registers a new user
    const user = new User(req.body)
    try {
        user.password = await bcrypt.hash(user.password, 10)
        await user.save
        res.status(201).send()
    }catch{
        res.status(500).send()
    }
});

app.get("/calc_user_score", async (req, res) => {
    //calculates user scores
});

app.get("/get_strongest", async (req, res) => {
    //returns the three strongest creatures
});


app.post("/update_enemy", async (req, res) => {
    //updates an enemy
});

app.get("/load_creature", async (req, res) => {
    //returns a creature
})

app.get("/check_end", async (req, res) => {
    //returns whether the end was reached TODO: maybe this can be implemented in a general get? that loads all data. 
})

app.get("/load_crystall_creature", async (req, res) => {
    //loads the creature holding a crystall. TODO: One load functiun that returns everything.
})

mongoose.connect(process.env.DB_CONNECTION_STRING,
                { useNewUrlParser: true, useUnifiedTopology: true },(req, res) =>{
    console.log("Connected to the database")
})

app.listen(PORT,() => {
    console.log("listening to 3000")
});
