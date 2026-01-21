import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set");
  process.exit(1);
}

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
		
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

void startServer();
