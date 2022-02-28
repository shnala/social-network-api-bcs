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

//DELETE a thought
//TODO: Test later, asynchronicity of deleting user may cause problems deleting their thoughts after the fact.
router.delete('/keelhaul/:id', async (req, res) => {
    try {
        const sharkbait = await Thought.findOneAndRemove({ _id: req.params.id })
        if (sharkbait) {
            const user = await User.findOneAndUpdate(
                { thoughts: req.params.id },
                { $pull: { thoughts: req.params.id } },
                { new: true }
            )
            console.log(user)
            console.log(`${sharkbait.username}'s thoughts are safe... at the bottom of the sea! Yarr harr harr!`)
            return res.json({ message: 'Yer thoughts are safe... at the bottom of the sea! Yarr harr harr!' })
        } else {
            return res.status(404).json({ message: 'Shiver me timbers! There be no thoughts by that id on this vessel!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    };
});


//POST route for reactions
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const reaction = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body}},
            { runValidators: true, new: true }
        )
        if (reaction) {
            console.log('Reaction posted')
            return res.json(reaction)
        } else {
            res.send('Arrr, there be no thought to react to, ye scurvy dog!')
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    };
});

//DELETE route for reactions
router.delete('/:thoughtId/reactions/:reactionId', async (req,res) => {
    try {
        const sharkbait = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        if (sharkbait) {
            console.log('Yer reaction has been deleted! Ye lily-livered landlubber! Arr harr harr!')
            return res.json({ message: 'Yer reaction has been deleted! Ye lily-livered landlubber! Arr harr harr!'})
        } else {
            res.status(404).json({ message: 'Shiver me timbers! There be no thoughts by that id on this vessel!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

module.exports = router;