import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/index.js";
import Interaction from "../src/models/Interaction.js";
import User from "../src/models/User.js";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  await Interaction.deleteMany({});
  await User.findOneAndUpdate(
    { _id: 999 },
    { $set: { _id: 999, name: "New User" } },
    { upsert: true }
  );
}, 30000);

afterAll(async () => {
  await Interaction.deleteMany({});
  await User.deleteOne({ _id: 999 });
  await mongoose.disconnect();
}, 30000);

describe("Personalized Marketplace Feed Tests", () => {
  test("1. Cold-start default feed: user with no interactions gets default listings", async () => {
    const res = await request(app).get("/api/recommendations/999");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].recommendationScore).toBe(0);
  });

  test("2. User isolation: different user interactions produce different feeds", async () => {
    await request(app)
      .post("/api/interactions")
      .send({ userId: 1, listingId: "L001", type: "CONTACT" });

    await request(app)
      .post("/api/interactions")
      .send({ userId: 2, listingId: "L002", type: "CONTACT" });

    const resUser1 = await request(app).get("/api/recommendations/1");
    const resUser2 = await request(app).get("/api/recommendations/2");

    expect(resUser1.statusCode).toBe(200);
    expect(resUser2.statusCode).toBe(200);

    expect(resUser1.body[0].category).toBe("vehicle");
    expect(resUser2.body[0].category).toBe("property");

    expect(resUser1.body[0]._id).not.toBe(resUser2.body[0]._id);
  });

  test("3. Repeated interactions: clicking save multiple times does not duplicate", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/interactions")
        .send({ userId: 1, listingId: "L003", type: "SAVE" });
    }

    const savedCount = await Interaction.countDocuments({
      userId: 1,
      listingId: "L003",
      type: "SAVE",
    });

    expect(savedCount).toBe(1);

    const res = await request(app).get("/api/recommendations/1");
    const hasL003 = res.body.some((item) => item._id === "L003");
    expect(hasL003).toBe(false);
  });
});
