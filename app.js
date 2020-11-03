const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv/config')

const app = express()

const Creature = require('./model/creatures')
const User = require('./model/user')
const Token = require('./model/tokens')

const PORT = process.env.PORT || 5000;


app.use(express.json());

app.post('/login', async (req, res) => {
    const user = await User.findOne({name: req.body.name})
    if(user == null){
        return res.status(400).send('cannot find user')
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)){
            
            const accessToken = generateAccessToken(user.toJSON())
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET)
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
    if (!(await User.findOne({token: refreshToken}))) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name})
        res.json({accessToken: accessToken})
    })
})

app.delete('/logout', async (req, res) => {
    await Token.findOneAndDelete({token: req.body.token})
    res.send(204)
})

app.post("/store_creature", authenticateToken, async (req, res) => {
    //stores a new creature
    res.json(req.user)
});

app.post("/create_user", async (req, res) => {
    //registers a new user
    const user = new User(req.body)
    try {
        user.password = await bcrypt.hash(user.password, 10)
        await user.save()
        res.status(201).send(user)
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

//Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //only get the token from the header
    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.send.status(403)
        req.user = user
        next()
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

mongoose.connect(process.env.DB_CONNECTION_STRING,
                { useNewUrlParser: true, useUnifiedTopology: true },(req, res) =>{
    console.log("Connected to the database")
})

app.listen(PORT,() => {
    console.log("listening to 3000")
});
