//import models
const { User, Event } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {

    me: async (parent, args,context) => {
      if(context.user){
        const userData = await User.findOne({_id: context.user._id})
        .select('-__v -password')
          .populate('events')
          .populate('friends');

          return userData;
      }
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('events')
        .populate('friends');
    },
    events: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Event.find(params).sort({ eventDate: -1 });
    },
    event: async (parent, { _id }) => {
      return event.findOne({ _id });
    },
  },
  Mutation:{
    //add user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
    //login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      return user;
    },
    addEvent: async (parent, args, context) => {
      if (context.user) {
        const event = await Event.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { events: event._id } },
          { new: true }
        );

        return event;
      }
    },
    addComment: async (parent, { eventId, commentBody }, context) => {
      if (context.user) {
        const updatedEvent = await Event.findOneAndUpdate(
          { _id: eventId },
          { $push: { comments: { commentBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        return updatedEvent;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    deleteEvent: async(parents, {eventId},context) => {
      if(context.user){
        const updatedUser = await User.findOneAndUpdate(
          {_id: context.user._id},
          {$pull: {events:eventId}},
          {new:true}
        ).populate('events');
        return updatedUser;
      }
    },
    deleteComment: async (parents, {commentId}, context) => {
      const updatedEvent = await Event.findOneAndUpdate(
        {_id: context.user._id},
        {$pull:{comments:commentId}},
        {new:true}
      ).populate('events');
      return updatedEvent;
    }
  }
};

  
module.exports = resolvers;