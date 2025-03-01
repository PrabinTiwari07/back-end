const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server, connectDB } = require("../app"); // Import server instance
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const { expect } = chai;
chai.use(chaiHttp);

let userToken;
let userId;

describe("User Profile API Tests", function () {
  
  before(async function () {
    await connectDB();
    await User.deleteMany({}); // Clear users before testing

    //  Create and store test user
    const hashedPassword = await bcrypt.hash("test123", 10);
    const testUser = new User({
      fullname: "Test User",
      email: "testuser@example.com",
      password: hashedPassword,
      phone: "1234567890",
      address: "Test Address",
      image: "",
      role: "user",
      isVerified: true
    });

    await testUser.save();
    userId = testUser._id.toString();

    //  User Login to obtain token
    const loginRes = await chai.request(server)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "test123" });

    userToken = loginRes.body.token;
    expect(userToken).to.exist;
  });

  after(async function () {
    await User.deleteMany({});
    server.close();
  });

  //  **Test Fetching User Profile**
  it("should fetch the logged-in user's profile", function (done) {
    chai.request(server)
      .get(`/api/profile/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", userId);
        expect(res.body).to.have.property("fullname", "Test User");
        done();
      });
  });

  
});
