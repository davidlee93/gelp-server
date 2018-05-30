const chai = require("chai");
const chaiHttp = require("chai-http");

const { app } = require("../src/server");

const should = chai.should();
chai.use(chaiHttp);

describe("Rating Router GET all Ratings", function() {
  it("should 200 on GET requests", function() {
    return chai
      .request(app)
      .get("/api/ratings/")
      .then(function(res) {
        return res.should.have.status(200);
      })
      .catch(err => {
        if (err instanceof chai.AssertionError) {
          throw err;
        }
        err.should.have.status(400);
      }).done;
  });
});
