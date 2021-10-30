const faker = require('faker');
const db = require('../connection');
const { User, Event} = require('../models');

db.once('open', async() => {
    await User.deleteMany({});
   //create user data
    const userData = [];

    for (let i = 0; i < 50; i += 1) {
        const username = faker.internet.userName();
        const email = faker.internet.email(username);
        const password = faker.internet.password();

        userData.push({ username, email, password });
    
    }

    let createdUsers = [];

    createdUsers = await User.collection.insertMany(userData);

    console.log('users seeded')

    // create friends
  for (let i = 0; i < 100; i += 1) {

    const randomUserIndex = Math.floor(Math.random() * userData.length);
    // console.log(randomUserIndex + " random user index")
    const { _id: userId } = userData[randomUserIndex];

    let friendId = userId;

    while (friendId === userId) {
      const randomUserIndex = Math.floor(Math.random() * userData.length);
      friendId = userData[randomUserIndex];
    }

    await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }

  console.log('friends seeded')

})