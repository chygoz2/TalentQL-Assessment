const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { post } = require("superagent");
const statusCodes = require("../../app/constants/statusCodes");
const db = require("../../app/models");
const { generateAccessToken } = require("../../app/utils");
const app = require("../../server");

chai.use(chaiHttp);
chai.should();
chai.expect();

describe("Like Controller", () => {
  before((done) => {
    process.env.TOKEN_SECRET = "123456";
    process.env.TOKEN_VALIDITY = "4h";
    done();
  });

  describe("/api/v1/likes", () => {
    it("can like a post", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(mickey.toJSON());
      const data = {
        postId: post.id,
      };
      const res = await chai
        .request(app)
        .post("/api/v1/likes")
        .set("Authorization", "Bearer " + jwt)
        .send(data);

      res.should.have.status(statusCodes.CREATED);
      expect(res.body.data.body).to.equal(data.body);
      expect(res.body.data.userId).to.equal(mickey.id);
      expect(res.body.data.postId).to.equal(post.id);
    });

    it("cannot like a post on missing input", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const jwt = generateAccessToken(mickey.toJSON());
      const data = {};
      const res = await chai
        .request(app)
        .post("/api/v1/likes")
        .set("Authorization", "Bearer " + jwt)
        .send(data);

      res.should.have.status(statusCodes.BAD_REQUEST);
    });
  });

  describe("/api/v1/likes/:likeId", () => {
    it("can unlike a post", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const like = await db.Likes.findOne({
          where: {
              postId: post.id
          }
      })
      const jwt = generateAccessToken(mickey.toJSON());
      const res = await chai
        .request(app)
        .delete("/api/v1/likes/" + like.id)
        .set("Authorization", "Bearer " + jwt)

      res.should.have.status(statusCodes.OK);
      expect(res.body.message).to.equal("Like deleted successfully");
    });
  });

  after(() => {
    app.server.close();
  });
});
