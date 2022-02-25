const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        // thoughtId: {
        //     type: Schema.Types.ObjectId,
        //     default: () => new Types.ObjectId(),
        // },
        username: {
            type: String,
            required: true,
        },
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
    //TODO: May or may not need to have a getter here.
);

const Thought = model('thought', thoughtSchema);
module.exports = Thought;