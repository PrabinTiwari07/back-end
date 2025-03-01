const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server, connectDB } = require("../app"); // Adjust import path if needed
const Service = require("../model/service");

const { expect } = chai;
chai.use(chaiHttp);

let serviceId; // Store service ID for tests

describe("User-Side Service API Tests", function () {
  
  before(async function () {
    await connectDB();
    await Service.deleteMany({}); // ✅ Clear previous services

    // ✅ Add a sample service for testing
    const newService = new Service({
      title: "Standard Laundry",
      description: "Includes washing & drying",
      category: "Cleaning",
      price: 20
    });

    const savedService = await newService.save();
    serviceId = savedService._id.toString(); // ✅ Store the created service ID
  });

  after(async function () {
    await Service.deleteMany({}); // ✅ Clean up test data
    server.close(); // ✅ Close server after tests
  });

  // ✅ Test Fetching All Services (Public)
  it("should fetch all available services", function (done) {
    chai.request(server)
      .get("/api/services")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
        done();
      });
  });

  // ✅ Test Fetching a Single Service by ID (Public)
  it("should fetch a single service by ID", function (done) {
    chai.request(server)
      .get(`/api/services/${serviceId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id", serviceId);
        done();
      });
  });

  // ✅ Test Fetching a Non-Existing Service
  it("should return 404 when fetching a non-existing service", function (done) {
    const fakeId = "65a7bfc2c8e45a12b3000000"; // Random invalid ID
    chai.request(server)
      .get(`/api/services/${fakeId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Service not found");
        done();
      });
  });

});
