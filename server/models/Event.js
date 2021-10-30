const {Schema, model } = require('mongoose');
const commentSchema = require('./Comment');
// const dateFormat = require('../utils/dateFormat');

const eventSchema = new Schema(
    {
        eventName:{
            type: String,
            required: 'Name is required',
            minlength: 1,
            maxlength: 280
        },
        eventDescription:{
            type: String,
            required: 'Input description',
            minlength: 1,
            maxlength: 280
        },
        eventDate:{
            type: Date,
            required: true
        },
        eventCategory:{
            type: String,
            required: true
        },
        eventMode: {
            type: String,
            required:true
        },
        location: {
            type: String,
            required: true
        },
        comments: [commentSchema]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
)

eventSchema.virtual('commentCount').get(function(){
    return this.comments.length;
});

const Event = model('Event', eventSchema);

module.exports = Event;