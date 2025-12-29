if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const DB_URL = process.env.DB_URL;

async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB");

    await initDB();

  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await mongoose.connection.close();
    console.log("DB connection closed");
  }
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("✅ Data was initialized");
};

main();
