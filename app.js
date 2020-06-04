const express = require("express")
const mongoose = require("mongoose")
require("dotenv/config")

const app = express()
const Creature = require("./model/user")
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

app.post("/update_enemy", async (req, res) => {
    console.log("called_update_enemy")
    try{
        const id = re.body["id"];
        const enemy = Creature.findById(id);
        var winrate = enemy["winrate"];
        var kills = enemy["kills"];
        var depth = enemy["depth"];
        if (req.body["won"]){
            winrate += 1;
            await Creature.update({"_id" : id},{$set: {"kills": kills + 1}})
            if(winrate > 2){
                await Creature.update(
                    {"_id" : id}, 
                    {$set: {"depth" : depth + 1, "winrate": 0 }});
            }
        }else{
            winrate -= 1;
            if(winrate < -2){
                await Creature.update(
                    {"_id" : id}, 
                    {$set: {"depth" : max(depth -1, 0), "winrate": 0 }});
            }
        }
    } catch(err){
        res.send({message: err})
        console.log(err)
    }
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