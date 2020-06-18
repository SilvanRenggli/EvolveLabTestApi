const express = require("express")
const mongoose = require("mongoose")
require("dotenv/config")

const app = express()
const Creature = require("./model/creatures")
const User = require("./model/user")
var PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/create_creature", async (req, res) => {
    try{
        const creature = new Creature(req.body);
        await creature.save();
        res.send(creature)
    } catch(err){
        res.send({message: err})
        console.log(err)
    }
});

app.post("/create_user", async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.send(user)
    } catch(err){
        res.send({message: err})
        console.log(err)
    }
});

app.get("/calc_user_score", async (req, res) => {
    try{
        Creature.aggregate([
            {$group: {
                _id : "$owner",
                score: {$sum : {$multiply :[
                    {$multiply: ["$depth", "$depth"]},
                    {$add: ["$kills", {"$literal" : 1}]}]}},
                deepest : {$max : "$depth"},
                kills : {$sum : "$kills"},
                creatures : {$sum: 1} 
            }},  
            {$sort: {score: -1}}
        ])
        .exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json(doc);
        })
    } catch(err){
        res.send({message: err})
        console.log(err)
    }
});


app.post("/update_enemy", async (req, res) => {
    console.log("called_update_enemy")
    const id = req.body["id"];
    var depth = req.body["depth"]
    var victories = req.body["victories"];
    Creature.find({depth: depth}).countDocuments().exec(async function (err, count) {
        Creature.findOne({"_id": id}).exec(async function (err, creature){
            if (req.body["won"]){
                creature.kills += victories;
                creature.crystall_countdown -= victories;
                //await Creature.update({"_id" : id},{$inc: {"kills": 1, "crystall_countdown": -1}})
                creature.winratio += victories;
                if(creature.winratio > 2 && count > 1){
                    await Creature.update(
                        {"_id" : id}, 
                        {$set: {"depth" : depth + 1, "winratio" : -2, "kills": creature.kills}});
                }else{
                    await Creature.update(
                        {"_id" : id}, 
                        {$set: {"winratio" : creature.winratio }});
                }
                if(creature.crystall_countdown <= 0){
                    await Creature.update(
                        {"_id" : id},
                        {$set: {"crystalls" : creature.crystalls + 1, "crystall_countdown" : 5}});
                }
            }else{
                creature.winratio -= 1
                if(creature.winratio < -2 && depth > 1 && count > 1){
                    await Creature.update(
                        {"_id" : id}, 
                        {$set: {"depth" : depth - 1, "winratio" : 2}});
                }else{
                    await Creature.update(
                        {"_id" : id}, 
                        {$set: {"winratio" : creature.winratio }});
                }
            }
            res.send(creature)
        }).catch(err) 
    }).catch(err)
});

app.get("/load_creature", async (req, res) => {

    var depth = req.body["depth"];
    Creature.find({depth: depth}).countDocuments().exec(function (err, count) {

    // Get a random entry
    var random = Math.floor(Math.random() * count)
  
    Creature.findOne({depth: depth}).skip(random)
    .exec()
    .then(doc => {
        console.log(doc)
        res.status(200).json(doc);
    })
    .catch(err)
  })
})

mongoose.connect(process.env.DB_CONNECTION_STRING,
                { useNewUrlParser: true, useUnifiedTopology: true },(req, res) =>{
    console.log("Connected to the database")
})

app.listen(PORT,() => {
    console.log("listening to 3000")
});
