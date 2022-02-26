const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// const { response } = require('express');
const { User, Thought } = require("../../models");

//GET all thoughts
router.get('/', async (req, res) => {
    try {
        console.log('Yarr! These scurvy dogs be plunderin our bounty of thoughts!')
        const thoughts = await Thought.find({
            include: [User]
        });
        if (thoughts) {
            // console.log('Yarr! The async function worked! Shiver me timbers')
            return res.json(thoughts);
        } else {
            return res.send('head empty.')
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    //This code works too, I just wanted to practice async
    // .then(thoughts=>{
    //     return res.json(thoughts);
    // }).catch((err) => {
    //     console.log(err);
    //     return res.status(500).json(err);
    // })
});

//GET a specific Thought
router.get('/:id', (req, res) => {
    Thought.findById(
        { _id: req.params.id }
    ).then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
    )
        .catch((err) => res.status(500).json(err));
})

//POST a new thought
router.post('/new/:id', async (req, res) => {
    try {
        const thought = await Thought.create(req.body)
        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $addToSet: { thoughts: thought } },
            { runValidators: true, new: true }
        )
        if (user) {
            console.log(user)
            console.log('Arr, ye thoughts been successfully posted, me hearty!')
            return res.json(thought)
        } else {
            return res.json('Yarr, there be no landlubber by that id, ye scurvy dog!')
        }
    }
    catch (err) {
        // console.log(err)
        res.status(500).json(err);
    }
});

//PUT a thought's information
router.put('/edit/:id', (req, res) => {
    Thought.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
    ).then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
    )
        .catch((err) => res.status(500).json(err));
});

//DELETE a user
//TODO: Test later, scallywag.thoughts may or may not cause issues due to misaligned field names?
//TODO: Test later, asynchronicity of deleting user may cause problems deleting their thoughts after the fact.
// router.delete('/walktheplank/:id', async (req, res) => {
//     try {
//         const scallywag = await User.findOneAndDelete({ _id: req.params.id })
//         // .then((scallywag) =>
//         if (scallywag) {
//             Thought.deleteMany({ _id: { $in: scallywag.thoughts } })
//             console.log(`Arr, to Davy Jones locker with that ${scallywag.username} scallywag!`)
//             return res.json({ message: 'Arr, to Davy Jones locker with that scallywag!' })
//         } else {
//             return res.status(404).json({ message: 'Shiver me timbers! There be no landlubber by that name on this vessel!' })
//         }
//         // !scallywag
//         //     ? res.status(404).json({ message: 'No user with this id!' })
//         //     : Thought.deleteMany({ _id: { $in: scallywag.thoughts } })
//         //         // )
//         //         .then(() => res.json({ message: 'Arr, to Davy Jones locker with that scallywag!' }))
//         //         .catch((err) => res.status(500).json(err));
//     } catch (err) {
//         console.log(err)
//         res.status(500).json(err)
//     }
// })
module.exports = router;