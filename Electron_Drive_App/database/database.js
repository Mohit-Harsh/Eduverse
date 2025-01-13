// database.js
const mongoose = require("mongoose");

class Database {
  constructor() {
    this.isConnected = false;
    this.mongoURI =
      "mongodb+srv://mohith8861:mxa2ormrYC42mLKx@cluster0.y9zyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    this.options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4,
    };
  }

  async connect() {
    if (this.isConnected) {
      console.log("Using existing database connection");
      return;
    }

    try {
      await mongoose.connect(this.mongoURI, this.options);

      this.isConnected = true;
      console.log("Database connection successful");

      // Handle connection errors after initial connection
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
        this.isConnected = false;
      });

      // Handle process termination
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error closing database connection:", error);
      throw error;
    }
  }
}

module.exports = new Database();
