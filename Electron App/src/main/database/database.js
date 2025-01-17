// database.js
const mongoose = require('mongoose')

class Database {
  constructor() {
    this.isConnected = false
    this.mongoURI = process.env.MONGO_URI
    this.options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4
    }
  }

  async connect() {
    if (this.isConnected) {
      return
    }

    try {
      await mongoose.connect(this.mongoURI, this.options)

      this.isConnected = true

      // Handle connection errors after initial connection
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        this.isConnected = false
      })

      // Handle process termination
      process.on('SIGINT', async () => {
        await mongoose.connection.close()
        process.exit(0)
      })
    } catch (error) {
      console.error('Error connecting to the database:', error)
      this.isConnected = false
      throw error
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.connection.close()
      this.isConnected = false
    } catch (error) {
      console.error('Error closing database connection:', error)
      throw error
    }
  }
}

export default Database
