const router = require('express').Router();
const { User, Thought } = require("../../models");

//GET all users
//TODO: make async w/ error catch
router.get('/', (req,res) => {
    console.log('Yarr! A vessel be approachin!')
    User.find({
        include:[Thought]
    }).then(users=>{
        return res.json(users);
    }).catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    })
});

//POST a new user
router.post('/new', (req,res) => {
    User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;