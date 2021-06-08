const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const statusCodes = require("../../app/constants/statusCodes");
const db = require("../../app/models");
const app = require("../../server");

chai.use(chaiHttp);
chai.should();
chai.expect();

describe("Auth Controller", () => {
  describe("/api/v1/auth/signup", () => {
    it("user can successfully sign up", (done) => {
      const data = {
        emailAddress: "goofy@example.com",
        password: "123456",
        firstName: "Goofy",
        lastName: "Cow",
      };
      chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send(data)
        .end((err, res) => {
          res.should.have.status(statusCodes.CREATED);
          expect(res.body.data.emailAddress).to.equal(data.emailAddress);
          expect(res.body.data.firstName).to.equal(data.firstName);
          expect(res.body.data.lastName).to.equal(data.lastName);
          done();
        });
    });

    it("registration fails on missing input", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send({
          password: "123456",
          firstName: "Mickey",
          lastName: "Mouse",
        })
        .end((err, res) => {
          res.should.have.status(statusCodes.BAD_REQUEST);
          done();
        });
    });

    it("registration fails on already existing email address", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/signup")
        .send({
          emailAddress: "mickey@example.com",
          password: "123456",
          firstName: "Mickey",
          lastName: "Mouse",
        })
        .end((err, res) => {
          res.should.have.status(statusCodes.BAD_REQUEST);
          done();
        });
    });
  });

  describe("/api/v1/auth/login", () => {
    it("should fail if login with non-existing details", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          emailAddress: "test@example.com",
          password: "123456",
        })
        .end((err, res) => {
          res.should.have.status(statusCodes.UNAUTHORIZED);
          done();
        });
    });

    it("should login successfully with correct details", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({
          emailAddress: "mickey@example.com",
          password: "123456",
        })
        .end((err, res) => {
          res.should.have.status(statusCodes.OK);
          done();
        });
    });
  });

  describe("/api/v1/auth/forgot-password", () => {
    it("should generate reset token if user initiates password reset", async () => {
      const email = "mickey@example.com";

      const res = await chai
        .request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          emailAddress: email,
        });

      res.should.have.status(statusCodes.OK);
      const user = await db.Users.findOne({
        where: { emailAddress: email },
      });
      expect(user.passwordResetToken).to.not.be.null;
    });
  });

  describe("/api/v1/auth/reset-password/:token", () => {
    it("should allow password change", async () => {
      const email = "mickey@example.com";

      let res = await chai
        .request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          emailAddress: email,
        });

      res.should.have.status(statusCodes.OK);
      const user = await db.Users.findOne({
        where: { emailAddress: email },
      });

      res = await chai
        .request(app)
        .post("/api/v1/auth/reset-password/" + user.passwordResetToken)
        .send({
          password: "987654",
        });

      res.should.have.status(statusCodes.OK);
      expect(res.body.message).to.equal("Password successfully reset");
    });

	it("Password should not be less than six characters long", async () => {
		const email = "mickey@example.com";
  
		let res = await chai
		  .request(app)
		  .post("/api/v1/auth/forgot-password")
		  .send({
			emailAddress: email,
		  });
  
		res.should.have.status(statusCodes.OK);
		const user = await db.Users.findOne({
		  where: { emailAddress: email },
		});
  
		res = await chai
		  .request(app)
		  .post("/api/v1/auth/reset-password/" + user.passwordResetToken)
		  .send({
			password: "98765",
		  });
  
		res.should.have.status(statusCodes.BAD_REQUEST);
		expect(res.body.errors[0].msg).to.equal("Must be at least 6 characters long");
	  });
  });

  after(() => {
    app.server.close();
  });
});
