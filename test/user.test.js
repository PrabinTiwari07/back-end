
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server, connectDB } = require("../app"); 
const User = require("../model/User"); 
const bcrypt = require("bcryptjs");

const { expect } = chai;
chai.use(chaiHttp);

let adminToken; 
let userToken; 
let testUserId; 

describe("User API Tests", function () {
  before(async function () {
    await connectDB();
    await User.deleteMany({ email: { $ne: "admin@example.com" } });   

    let adminUser = await User.findOne({ email: "admin@example.com" });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = new User({
        fullname: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        phone: "9876543210",
        address: "Admin Address",
        role: "admin",
        isVerified: true,
      });

      await adminUser.save();
    }

    const adminRes = await chai.request(server)
      .post("/api/users/login")
      .send({ email: "admin@example.com", password: "admin123" });

    adminToken = adminRes.body.token;
    expect(adminToken).to.exist;

    console.log("🛡️ Admin Token:", adminToken);
  });

  after(async function () {
    await User.deleteMany({ email: { $ne: "admin@example.com" } }); 
    server.close(); 
  });

  it("should create a new user", function (done) {
    const newUser = {
      fullname: "Test User",
      email: "testuser@example.com",
      password: "test123",
      phone: "1234567890",
      address: "Test Address",
    };

    chai.request(server)
      .post("/api/users/register")
      .send(newUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "OTP sent to email. Please verify.");
        done();
      });
  });

  it("should verify the user's OTP", async function () {
    const user = await User.findOne({ email: "testuser@example.com" });
    expect(user).to.exist;
    expect(user.otp).to.exist;

    testUserId = user._id; 
    const res = await chai.request(server)
      .post("/api/users/verify-otp")
      .send({ email: "testuser@example.com", otp: user.otp });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Email verified. You can now log in.");

    await User.findByIdAndUpdate(user._id, { isVerified: true });
  });

  it("should allow a user to log in", function (done) {
    const loginDetails = {
      email: "testuser@example.com",
      password: "test123",
    };

    chai.request(server)
      .post("/api/users/login")
      .send(loginDetails)
      .end(function (err, res) {
        console.log("📌 Login Response:", res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        userToken = res.body.token;
        done();
      });
  });

  it("should resend OTP for verification", function (done) {
    chai.request(server)
      .post("/api/users/resend-otp")
      .send({ email: "testuser@example.com" })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "New OTP sent to email.");
        done();
      });
  });

  it("should return error for invalid OTP", function (done) {
    chai.request(server)
      .post("/api/users/verify-otp")
      .send({ email: "testuser@example.com", otp: "000000" }) 
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Invalid or expired OTP");
        done();
      });
  });

  it("should update the user profile", function (done) {
    const updatedUser = {
      fullname: "Updated User",
      address: "Updated Address",
      phone: "9876543210",
    };

    chai.request(server)
      .put(`/api/users/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(updatedUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("fullname", "Updated User");
        expect(res.body).to.have.property("address", "Updated Address");
        done();
      });
  });

  it("should return error for invalid OTP", function (done) {
    chai.request(server)
      .post("/api/users/verify-otp")
      .send({ email: "testuser@example.com", otp: "000000" })  
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "Invalid or expired OTP");
        done();
      });
  });

});

