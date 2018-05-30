const faker = require("faker");
const mongoose = require("mongoose");

const { User } = require("../src/models/users");
const { Rating } = require("../src/models/ratings");

function generateUserData() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  };
}

function generateRatingData() {
  return {
    userId: faker.random.number(),
    restId: faker.random.number(),
    userFirstName: faker.random.word(),
    userLastName: faker.random.word(),
    userZipcode: faker.random.number(),
    userCreated: faker.date.past(),
    created: faker.date.past(),
    quantity: faker.random.number(),
    quality: faker.random.number(),
    pricing: faker.random.number(),
    textarea: faker.random.word()
  };
}

function createTestUser() {
  return User.create(generateUserData());
}

function createTestUserAndPostRatings(i) {
  console.log(`Creating User ${i + 1}`);
  const testUser = {
    email: faker.internet.email(),
    password: null,
    firstName: faker.random.word(),
    lastName: faker.random.word(),
    zipcode: faker.random.number()
  };
  return User.hashPassword(faker.internet.password())
    .then(password => {
      testUser.password = password;
      return User.create(testUser);
    })
    .then(user => {
      const userId = user._id;
      let j = 0;
      const ratingPromises = [];
      while (j < 2) {
        console.log(`Generating rating ${j + 1} for user`);
        const newRating = generateRatingData();
        newRating.userId = userId;
        ratingPromises.push(Rating.create(newRating));
        j++;
      }
      console.log("Generated Rating");
      console.log("==================");
      return Promise.all(ratingPromises);
    })
    .catch(err => {
      console.error(err);
    });
}

function seedGelpDatabase() {
  let i = 0;
  const promises = [];
  while (i < 2) {
    promises.push(createTestUserAndPostRatings(i));
    i++;
  }
  console.log("Generated iteration of user data");
  console.log(".....................");
  return Promise.all(promises);
}

function teardownDatabase() {
  console.warn("Deleting database...");
  return mongoose.connection.dropDatabase();
}

module.exports = {
  seedGelpDatabase,
  generateUserData,
  generateRatingData,
  createTestUser,
  teardownDatabase
};
