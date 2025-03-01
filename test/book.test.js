const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server, connectDB } = require("../app");
const Book = require("../model/book");
const User = require("../model/User");
const Service = require("../model/service");

const { expect } = chai;
chai.use(chaiHttp);

let userToken;
let adminToken;
let testBookingId;
let testServiceId;

describe("Booking API Tests", function () {
  before(async function () {
    await connectDB();
    await Book.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({ email: "testuser@example.com" });
  
    // ✅ Create a service
    const newService = new Service({
      title: "Laundry Service",
      description: "Washing and drying clothes",
      category: "Cleaning",
      price: 20
    });
    const savedService = await newService.save();
    testServiceId = savedService._id.toString();
  
    // ✅ Register User
    const newUser = {
      fullname: "Test User",
      email: "testuser@example.com",
      password: "test123",
      phone: "1234567890",
      address: "Test Address",
      role: "user",
    };
    await chai.request(server).post("/api/users/register").send(newUser);
    
    // ✅ Ensure user is verified before login
    const user = await User.findOne({ email: "testuser@example.com" });
    await User.findByIdAndUpdate(user._id, { isVerified: true });
  
    // ✅ User Login
    const loginRes = await chai.request(server)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "test123" });
  
    userToken = loginRes.body.token;
    console.log("👤 User Token:", userToken); // 🔥 Debugging
    expect(userToken).to.exist;
  
    // ✅ Admin Login
    const adminLoginRes = await chai.request(server)
      .post("/api/users/login")
      .send({ email: "admin@example.com", password: "admin123" });
  
    adminToken = adminLoginRes.body.token;
    console.log("🛡️ Admin Token:", adminToken); // 🔥 Debugging
    expect(adminToken).to.exist;
  });
  

  after(async function () {
    await Book.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({ email: "testuser@example.com" });
    server.close();
  });

  // ✅ Test Creating a Booking
  it("should create a new booking", function (done) {
    const bookingData = {
      serviceId: testServiceId,
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
    };

    chai.request(server)
      .post("/api/books")
      .set("Authorization", `Bearer ${userToken}`)
      .send(bookingData)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "Booking confirmed");
        testBookingId = res.body.book._id;
        done();
      });
  });

  // ✅ Test Fetching All Bookings for User
  it("should fetch all bookings for the logged-in user", function (done) {
    chai.request(server)
      .get("/api/books/my-books")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  // ✅ Test Fetching All Bookings by Service
  it("should fetch all bookings for a specific service", function (done) {
    chai.request(server)
      .get(`/api/books/service/${testServiceId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  // ✅ Test Fetching All Bookings (Admin Only)
  it("should allow admin to fetch all bookings", function (done) {
    chai.request(server)
      .get("/api/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  // ✅ Test Updating Booking Status
  it("should allow admin to update booking status", function (done) {
    const updatedStatus = { status: "confirmed" };

    chai.request(server)
      .put(`/api/books/${testBookingId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedStatus)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Booking status updated");
        done();
      });
  });

  // ✅ Test Fetching a Non-Existing Booking
  it("should return 404 when fetching a non-existing booking", function (done) {
    const fakeId = "65a7bfc2c8e45a12b3000000";
    chai.request(server)
      .get(`/api/books/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Booking not found");
        done();
      });
  });
});
