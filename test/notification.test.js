const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server, connectDB } = require("../app");
const Notification = require("../model/Notification");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

const { expect } = chai;
chai.use(chaiHttp);

let userToken;
let userId;
let notificationId;

describe("Notification API Tests", function () {
  before(async function () {
    await connectDB();
    await Notification.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("user123", 10);
    const testUser = new User({
      fullname: "Test User",
      email: "user@example.com",
      password: hashedPassword,
      phone: "1234567890",
      address: "Test Address",
      role: "user",
      isVerified: true
    });
    await testUser.save();
    userId = testUser._id.toString();

    const res = await chai.request(server)
      .post("/api/users/login")
      .send({ email: "user@example.com", password: "user123" });

    userToken = res.body.token;
    expect(userToken).to.exist;
  });

  after(async function () {
    await Notification.deleteMany({});
    await User.deleteMany({});
    server.close();
  });

  it("should create a notification", function (done) {
    const newNotification = {
      userId: userId,
      title: "New Message",
      message: "You have a new notification"
    };

    chai.request(server)
      .post("/api/notifications")
      .set("Authorization", `Bearer ${userToken}`)
      .send(newNotification)
      .end(function (err, res) {
        console.log("📢 Notification Creation Response:", res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("_id");
        notificationId = res.body._id;
        done();
      });
  });

  it("should fetch all notifications for a user", function (done) {
    chai.request(server)
      .get(`/api/notifications/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .end(function (err, res) {
        console.log("📜 Fetch Notifications Response:", res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should mark a notification as read", function (done) {
    chai.request(server)
      .put(`/api/notifications/${notificationId}/read`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ isRead: true })
      .end(function (err, res) {
        console.log(" Mark Notification Read Response:", res.body);
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should delete a notification", function (done) {
    chai.request(server)
      .delete(`/api/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .end(function (err, res) {
        console.log("❌ Delete Notification Response:", res.body);
        expect(res).to.have.status(200);
        done();
      });
  });
});
