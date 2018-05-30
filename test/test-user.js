"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const should = require("chai").should();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, runServer, closeServer } = require("../src/server");
const { User } = require("../src/models/users");
const { TEST_DATABASE_URL, JWT_SECRET } = require("../src/config/config");

const expect = chai.expect;

const { seedGelpDatabase, teardownDatabase } = require("./test-functions");

chai.use(chaiHttp);

describe("User Router to /api/user", () => {
  let testUser;
  let testUserData;

  before(function() {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  beforeEach(done => {
    testUserData = {
      email: faker.internet.email(),
      unhashedPassword: faker.internet.password(),
      firstName: faker.random.word(),
      lastName: faker.random.word(),
      zipcode: faker.random.number()
    };
    User.hashPassword(testUserData.unhashedPassword)
      .then(password => {
        testUserData.password = password;
        return User.create(testUserData);
      })
      .then(user => {
        testUser = user;
        seedGelpDatabase().then(() => done());
      })
      .catch(err => console.log(err));
  });

  afterEach(() => teardownDatabase());

  after(function() {
    return closeServer();
  });
  describe("POST request to /user", () => {
    it("Should create a new user in the database", () => {
      const newUser = {
        email: faker.internet.email(),
        password: "123123123",
        firstName: "testing",
        lastName: "testing",
        zipcode: 123123
      };
      return chai
        .request(app)
        .post("/api/users")
        .send(newUser)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.include.keys("message");
        })
        .catch(err => console.log(err));
    });

    it("Should throw an error if fields missing", () => {
      const newUser = {
        email: faker.internet.email()
      };
      return chai
        .request(app)
        .post("/api/signup")
        .send(newUser)
        .catch(err => {
          err.should.have.status(422);
        });
    });

    it("Should reject users with password greater than 72 characters", function() {
      testUserData.password = new Array(73).fill("a").join("");
      return chai
        .request(app)
        .post("/api/users")
        .send(testUserData)
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Must be at most 72 characters long"
          );
        });
    });
    it("Should reject users with duplicate email", function() {
      // Create an initial user
      return User.create(testUserData)
        .then(() =>
          // Try to create a second user with the same email
          chai
            .request(app)
            .post("/api/users")
            .send(testUserData)
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(409);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal("email already taken");
        });
    });
  });
});
