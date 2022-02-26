const router = require('express').Router();
// const { response } = require('express');
const { User, Thought } = require("../../models");

//GET all users
//TODO: Note that include: Thought isn't actually doing anything and that the thoughts array comes from the schema itself.
router.get('/', async (req, res) => {
    try {
        console.log('Yarr! A vessel be approachin!')
        const users = await User.find({
            include: [Thought]
        });
        if (users) {
            // console.log('Yarr! The async function worked! Shiver me timbers')
            return res.json(users);
        } else {
            return res.send('There are currently no users.')
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    //This code works too, I just wanted to practice async
    // .then(users=>{
    //     return res.json(users);
    // }).catch((err) => {
    //     console.log(err);
    //     return res.status(500).json(err);
    // })
});

//GET a specific user
router.get('/:id', (req, res) => {
    User.findById(
        { _id: req.params.id }
    ).then((user) =>
        !user
            ? res.status(404).json({ message: 'No user with this id!' })
            : res.json(user)
    )
        .catch((err) => res.status(500).json(err));
})

//POST a new user
router.post('/new', (req,res) => {
    User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

//PUT a user's information
router.put('/edit/:id', (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
    ).then((user) =>
        !user
            ? res.status(404).json({ message: 'No user with this id!' })
            : res.json(user)
    )
        .catch((err) => res.status(500).json(err));
});

//DELETE a user
//TODO: Test later, scallywag.thoughts may or may not cause issues due to misaligned field names?
//TODO: Test later, asynchronicity of deleting user may cause problems deleting their thoughts after the fact.
router.delete('/walktheplank/:id', async (req, res) => {
    try {
        const scallywag = await User.findOneAndDelete({ _id: req.params.id })
        // .then((scallywag) =>
        if (scallywag) {
            Thought.deleteMany({ _id: { $in: scallywag.thoughts } })
            console.log(`Arr, to Davy Jones locker with that ${scallywag.username} scallywag!`)
            return res.json({ message: 'Arr, to Davy Jones locker with that scallywag!' })
        } else {
            return res.status(404).json({ message: 'Shiver me timbers! There be no landlubber by that name on this vessel!' })
        }
        // !scallywag
        //     ? res.status(404).json({ message: 'No user with this id!' })
        //     : Thought.deleteMany({ _id: { $in: scallywag.thoughts } })
        //         // )
        //         .then(() => res.json({ message: 'Arr, to Davy Jones locker with that scallywag!' }))
        //         .catch((err) => res.status(500).json(err));
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})
module.exports = router;