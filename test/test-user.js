"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../src/server");
const { User } = require("../src/models/users");
const { TEST_DATABASE_URL } = require("../src/config/config");

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe("/api/user", function() {
  const email = "example@User.com";
  const password = "examplePass";
  const firstname = "Example";
  const lastname = "User";
  const zipcode = "123123";
  const emailB = "example@UserB.com";
  const passwordB = "examplePassB";
  const firstnameB = "ExampleB";
  const lastnameB = "UserB";

  before(function() {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe("/api/users", function() {
    describe("POST", function() {
      it("Should reject users with missing email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            password,
            firstname,
            lastname,
            zipcode
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with missing password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            firstname,
            lastname,
            zipcode
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with empty email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: "",
            password,
            firstname,
            lastname,
            zipcode
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
          });
      });

      it("Should reject users with password greater than 72 characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: new Array(73).fill("a").join(""),
            firstname,
            lastname,
            zipcode
          })
          .then(() => expect.fail(null, null, "Request should not succeed"))
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
        return User.create({
          email,
          password,
          firstname,
          lastname,
          zipcode
        })
          .then(() =>
            // Try to create a second user with the same email
            chai
              .request(app)
              .post("/api/users")
              .send({
                email,
                password,
                firstname,
                lastname,
                zipcode
              })
          )
          .then(() => expect.fail(null, null, "Request should not succeed"))
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("email already taken");
          });
      });
      it("Should create a new user", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password,
            firstname,
            lastname,
            zipcode
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys(
              "email",
              "firstname",
              "lastname",
              "password",
              "zipcode"
            );
            expect(res.body.email).to.equal(email);
            expect(res.body.firstname).to.equal(firstname);
            expect(res.body.lastname).to.equal(lastname);
            return User.findOne({
              email
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstname).to.equal(firstname);
            expect(user.lastname).to.equal(lastname);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });

    describe("GET", function() {
      it("Should return an empty array initially", function() {
        return chai
          .request(app)
          .get("/api/users")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(0);
          });
      });
      it("Should return an array of users", function() {
        return User.create(
          {
            email,
            password,
            firstname,
            lastname,
            zipcode
          },
          {
            email: emailB,
            password: passwordB,
            firstname: firstnameB,
            lastname: lastnameB,
            zipcode: zipcode
          }
        )
          .then(() => chai.request(app).get("/api/users"))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              email,
              firstname,
              lastname,
              zipcode
            });
            expect(res.body[1]).to.deep.equal({
              email: emailB,
              firstname: firstnameB,
              lastname: lastnameB,
              zipcode
            });
          });
      });
    });
  });
});
