const router = require('express').Router();
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
router.post('/new', (req, res) => {
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
router.delete('/walktheplank/:id', async (req, res) => {
    try {
        User.findOne({ _id: req.params.id })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that id, arrrr' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
        //This chunk of code below doesn't work but is nearly identical to the turnary above, which does work. I cannot discern why so I am leaving this here for future reference.
        // .then ((user) => {
        //     Thought.deleteMany({ _id: { $in: user.thoughts } })
        // })
        const scallywag = await User.findOneAndDelete({ _id: req.params.id })
        if (scallywag) {
            // Thought.deleteMany({ _id: { $in: scallywag.thoughts } })
            console.log(`Arr, to Davy Jones locker with that ${scallywag.username} scallywag!`)
            return res.json({ message: 'Arr, to Davy Jones locker with that scallywag!' })
        } else {
            return res.status(404).json({ message: 'Shiver me timbers! There be no landlubber by that name on this vessel!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    };
});

//POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: { _id: req.params.friendId } } },
            { new: true }
        )
        if (user) {
            return res.json({ message: `Yo ho ho! Looks like ${user.username} has a new buddy to sail with! Yarrrgh!` })
        } else {
            return res.send('Ye scurvy dog, there be no landlubber by that name on this vessel!')
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    };
});

//DELETE route to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const scurvydog = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        if (scurvydog) {
            console.log(scurvydog);
            console.log('Mutiny! Yer friend has been deleted! Arr harr harr!')
            return res.json({ message: 'Mutiny! Yer friend has been deleted! Arr harr harr!' })
        } else {
            res.status(404).json({ message: 'Shiver me timbers! There be no scurvy dogs by that id on this vessel!' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    };
});

module.exports = router;