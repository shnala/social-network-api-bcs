const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    await User.deleteMany({});
    await Thought.deleteMany({});

    await User.collection.insertOne({
        username: 'shawnanalla',
        email: 'shawnanalla@gmail.com',
    });

    await Thought.collection.insertOne({
        username: 'shawnanalla',
        thoughtText: 'This thought was seeded via the seed.js file. It therefore does not appear in the users thoughts array because ids for each instance of Thought are randomly generated upon creation, however the thought still exists in the database.'
    });

    console.log('Seeding complete. One user and one thought have been generated.')
    process.exit(0);

})