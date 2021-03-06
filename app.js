const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv/config')

const app = express()

const Creature = require('./model/creature')
const User = require('./model/user')
const Token = require('./model/tokens')
const UserData = require('./model/userData')


const PORT = process.env.PORT || 5000;


app.use(express.json());

app.post('/login', async (req, res) => {
    const user = await User.findOne({name: req.body.name})
    if(user == null){
        return res.status(400).send('cannot find user')
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)){
            
            const username = {username: user.name}
            const accessToken = generateAccessToken(username)
            const refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET)
            res.json({accessToken: accessToken,refreshToken: refreshToken})
            const token = new Token({token: refreshToken})
            await token.save()

        } else {
            res.send('Not Allowed')
        }
    }catch{
        res.status(500).send()
    }
})

app.post('/token', async (req,res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    const token = await Token.findOne({token: refreshToken})
    if (token == null) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, username) =>{
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ username: username.name})
        res.json({accessToken: accessToken})
    })
})

app.delete('/logout', async (req, res) => {
    await Token.findOneAndDelete({token: req.body.token})
    res.send(204)
})

app.post("/store_creature", authenticateToken, async (req, res) => {
    //stores a new creature
    const creature = new Creature(req.body)
    if (creature.owner !== req.username.username) { return res.sendStatus(403) }
    try{
        await creature.save()
        res.sendStatus(200)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
});

app.post("/create_user", async (req, res) => {
    //registers a new user
    const user = new User(req.body)
    
    try {
        user.password = await bcrypt.hash(req.body.password, 10)
        await user.save()
        res.status(201).send(user)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
});

app.post("/save_user_data", authenticateToken, async(req, res) => {
    //replaces the userdata in the DB with the one from the body
    try{
    const filter = { name: req.username.username }
    const newUserData = req.body
    newUserData.name = req.username.username
    const result = await UserData.replaceOne(filter, newUserData, {upsert: true} )
    res.status(201).send()
    }catch{
        res.status(500).send()
    }

}) 

app.get("/load_user_data", authenticateToken, async(req, res) => {
    //loads all the user data from the server
    try{
        const filter = { name: req.username.username }
        const data = await UserData.findOne(filter)
        res.send(data)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

app.get("/get_score", async (req, res) => {
    //calculates user scores
});

app.get("/get_depth_info", authenticateToken, async (req, res) => {

    const depth = req.body.depth
    var depthInfo = {
        endReached: false,
        randomEnemy: [],
        crystalEnemy: [],
        topCreatures: []
    }
    try{
        //add a random creature to the body
        depthInfo.randomEnemy = await Creature.aggregate([
            { $match: { depth: depth } },
            { $sample: { size: 1 } }
        ])

        //check whether end was reached
        depthInfo.endReached = ( depthInfo.randomEnemy.length == 0 )

        //add a random creature with a crystal to the body if one exists at depth
        depthInfo.crystalEnemy = await Creature.aggregate([
            { $match: { depth: depth, crystals: { $gte: 1} } },
            { $sample: {size: 1} }
        ])

        //add the top three creatures to the body
        depthInfo.topCreatures = await Creature.find({ depth: depth, battlePoints: { $gte: 5 } }).sort({ battlePoints: -1 }).limit(3)

        res.send(depthInfo).status(200)
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
    
});


app.post("/update_enemy", authenticateToken, async (req, res) => {
    //updates an enemy
});

//Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //only get the token from the header
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
        if (err) return res.send().status(403)
        req.username = username
        next()
    })
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

mongoose.connect(process.env.DB_CONNECTION_STRING,
                { useNewUrlParser: true, useUnifiedTopology: true },(req, res) =>{
    console.log("Connected to the database")
})

app.listen(PORT,() => {
    console.log("listening to 3000")
});
