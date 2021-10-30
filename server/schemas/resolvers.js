//import models
const { User, Event } = require('../models');

const resolvers = {
  Query: {
      //query all events by a user
    events: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Event.find(params).sort({ eventDate: -1 });
    },
    //find event by id 
    event: async (parent, { _id }) => {
      return Event.findOne({ _id });
    },
    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('events');
},
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('events');
},

  }
};

  
module.exports = resolvers;