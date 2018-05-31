"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../src/server");
const { User } = require("../src/models/users");
const { JWT_SECRET, TEST_DATABASE_URL } = require("../src/config/config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Auth endpoints", function() {
  const email = "example@email.com";
  const password = "examplePass";
  const firstName = "Example";
  const lastName = "User";
  const zipcode = "123456";
  const ratings = [];
  const created = "";

  before(function() {
    return runServer(TEST_DATABASE_URL, 8081);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        email,
        password,
        firstName,
        lastName,
        zipcode
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

  describe("/api/auth/login", function() {
    it("Should reject requests with no credentials", function() {
      return chai
        .request(app)
        .post("/api/auth/login")
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          err.should.have.status(400);
        });
    });
    it("Should reject requests with incorrect emails", function() {
      return chai
        .request(app)
        .post("/api/auth/login")
        .send({ email: "wrong email", password })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          err.should.have.status(422);
        });
    });
  });
});
