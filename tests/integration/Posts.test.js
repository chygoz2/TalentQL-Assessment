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
    it("can create post", async () => {
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
      expect(res.body.data.replies.length).to.equal(0);
      expect(res.body.data.likes.length).to.equal(0);
    });

    it("cannot create post on missing input", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const jwt = generateAccessToken(mickey.toJSON());
      const data = {};
      const res = await chai
        .request(app)
        .post("/api/v1/posts")
        .set("Authorization", "Bearer " + jwt)
        .send(data);

      res.should.have.status(statusCodes.BAD_REQUEST);
    });

    it("cannot create post on missing authorization token", async () => {
      const data = {};
      const res = await chai
        .request(app)
        .post("/api/v1/posts")
        .send(data);

      res.should.have.status(statusCodes.UNAUTHORIZED);
    });
  });

  describe("/api/v1/posts/:postId", () => {
    it("can get post", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(mickey.toJSON());
      const res = await chai
        .request(app)
        .get("/api/v1/posts/" + post.id)
        .set("Authorization", "Bearer " + jwt);

      res.should.have.status(statusCodes.OK);
      expect(res.body.data.body).to.equal(post.body);
    });

    it("cannot get post that does not exist", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(mickey.toJSON());
      const res = await chai
        .request(app)
        .get("/api/v1/posts/" + 1000)
        .set("Authorization", "Bearer " + jwt);

      res.should.have.status(statusCodes.NOT_FOUND);
    });

    it("can edit post", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(mickey.toJSON());
      const data = {
        body: "Edit post body",
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/posts/" + post.id)
        .set("Authorization", "Bearer " + jwt)
        .send(data);

      res.should.have.status(statusCodes.OK);
      expect(res.body.data.body).to.equal(data.body);
    });

    it("cannot edit post created by another user", async () => {
      const donald = await db.Users.findOne({
        where: {
          emailAddress: "donald@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(donald.toJSON());
      const data = {
        body: "Edit post body",
      };
      const res = await chai
        .request(app)
        .patch("/api/v1/posts/" + post.id)
        .set("Authorization", "Bearer " + jwt)
        .send(data);

      res.should.have.status(statusCodes.FORBIDDEN);
    });

    it("can delete post", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(mickey.toJSON());

      const res = await chai
        .request(app)
        .delete("/api/v1/posts/" + post.id)
        .set("Authorization", "Bearer " + jwt);

      res.should.have.status(statusCodes.OK);
      expect(res.body.message).to.equal("Post deleted successfully");
    });

    it("cannot delete post created by another user", async () => {
      const mickey = await db.Users.findOne({
        where: {
          emailAddress: "mickey@example.com",
        },
      });
      const post = await db.Posts.findOne();
      const jwt = generateAccessToken(mickey.toJSON());

      const res = await chai
        .request(app)
        .delete("/api/v1/posts/" + post.id)
        .set("Authorization", "Bearer " + jwt);

      res.should.have.status(statusCodes.FORBIDDEN);
    });
  });

  after(() => {
    app.server.close();
  });
});
