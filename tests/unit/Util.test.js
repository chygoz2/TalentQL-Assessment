const { expect } = require("chai");
const chai = require("chai");
const db = require("../../app/models");
const { generateAccessToken } = require("../../app/utils");

chai.should();
chai.expect();

describe("Utility functions", () => {
  before((done) => {
    process.env.TOKEN_SECRET = "123456";
    process.env.TOKEN_VALIDITY = "4h";
    done();
  });

  it("can generate access token", async () => {
    const mickey = await db.Users.findOne({
      where: {
        emailAddress: "mickey@example.com",
      },
    });
    
    const jwt = generateAccessToken(mickey.toJSON());
    expect(jwt).to.not.be.null;
  });

  it("can generate reset token", async () => {
    const mickey = await db.Users.findOne({
      where: {
        emailAddress: "mickey@example.com",
      },
    });
    
    const jwt = generateAccessToken(mickey.toJSON());
    expect(jwt).to.not.be.null;
  });

});
