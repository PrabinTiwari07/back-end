const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server, connectDB } = require("../app"); 
const Service = require("../model/service");

const { expect } = chai;
chai.use(chaiHttp);

let serviceId; 
let categoryTest = "Cleaning"; 

describe("User-Side Service API Tests", function () {
  
  before(async function () {
    await connectDB();
    await Service.deleteMany({}); 

    const newService1 = new Service({
      title: "Standard Laundry",
      description: "Includes washing & drying",
      category: categoryTest,
      price: 20
    });

    const newService2 = new Service({
      title: "Dry Cleaning",
      description: "Professional dry cleaning service",
      category: "Dry Cleaning",
      price: 50
    });

    const savedService1 = await newService1.save();
    const savedService2 = await newService2.save();
    serviceId = savedService1._id.toString(); 
  });

  after(async function () {
    await Service.deleteMany({}); 
    server.close(); 
  });

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

  it("should return 404 when fetching a non-existing service", function (done) {
    const fakeId = "65a7bfc2c8e45a12b3000000"; 
    chai.request(server)
      .get(`/api/services/${fakeId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Service not found");
        done();
      });
  });

 
  it("should include price details when fetching a service", function (done) {
    chai.request(server)
      .get(`/api/services/${serviceId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("price");
        expect(res.body.price).to.be.a("number");
        done();
      });
  });
  

});
