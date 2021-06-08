const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const statusCodes = require("../../app/constants/statusCodes");
const db = require("../../app/models");
const { generateAccessToken } = require("../../app/utils");
const app = require("../../server");

chai.use(chaiHttp);
chai.should();
chai.expect();

describe("Posts Controller", () => {
  before((done) => {
    process.env.TOKEN_SECRET = "123456";
    process.env.TOKEN_VALIDITY = "4h";
    done();
  });

  describe("/api/v1/posts", () => {
    it("user can create post", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const jwt = generateAccessToken(mickey.toJSON());
      const data = {
        body: "Test post body",
      };
      const res = await chai
        .request(app)
        .post("/api/v1/posts")
        .set("Authorization", "Bearer " + jwt)
        .send(data);

      res.should.have.status(statusCodes.CREATED);
      expect(res.body.data.body).to.equal(data.body);
      expect(res.body.data.creatorId).to.equal(mickey.id);
      expect(res.body.data.replies.length).to.equal(0)
      expect(res.body.data.likes.length).to.equal(0)
    });
  });

  after(() => {
    app.server.close();
  });
});
