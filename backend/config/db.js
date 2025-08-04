import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config().parsed;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`successfully connected to mongo DB`);
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
