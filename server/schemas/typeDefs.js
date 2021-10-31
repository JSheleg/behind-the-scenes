// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  friendCount: Int
  events: [Event]
  friends: [User]
} 
  
type Event {
  _id: ID
  eventName: String
  eventDescripton: String
  eventDate: String
  eventCategory: String
  eventMode: String
  location: String
  comments: [Comment]
  commentCount: Int
}
type Comment {
  _id: ID
  commentBody: String
  createdAt: String
  username: String
  
}
type Query {
  me: User
  users: [User]
  user(username: String!): User
  events(username: String): [Event]
  event(_id: ID!): Event
}
type Mutation{
  login(email:String!, password:String!):User
  addUser(username: String!, email: String!, password: String!): User
  addEvent(eventName:String!, eventDescription:String!): Event
  deleteEvent(eventId: ID!):Event
  addComment(eventId:ID!,commentBody:String!): Event
  deleteComment(commentId:ID!):Event
  addFriend(friendId:ID!):User
}
`;

// export the typeDefs
module.exports = typeDefs;