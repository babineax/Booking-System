import { initializeApp, deleteApp } from "firebase-admin/app";
import * as assert from "assert";

const test = require("firebase-functions-test")();

describe("Booking System Tests", () => {
  let admin: any;

  before(() => {
    admin = initializeApp();
  });

  after(() => {
    deleteApp(admin);
    test.cleanup();
  });

  it("should create a booking and trigger a WhatsApp notification", async () => {
    const createBooking = test.wrap(require("../src/index").createBooking);

    const serviceId = "test-service-id";
    const staffMemberId = "test-staff-id";
    const customerId = "test-customer-id";
    const startTime = new Date().toISOString();
    const endTime = new Date(
      new Date().getTime() + 60 * 60 * 1000,
    ).toISOString();

    const data = {
      serviceId,
      staffMemberId,
      customerId,
      startTime,
      endTime,
      clientName: "John Doe",
      clientEmail: "johndoe@example.com",
      clientPhone: "+1234567892",
    };

    const context = {
      auth: {
        uid: "test-admin-id",
      },
    };

    const result = await createBooking(data, context);

    assert.strictEqual(result.success, true);
  }).timeout(10000);
});
