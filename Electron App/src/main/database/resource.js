// models/Resources.js
const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    drive_link: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number
      // required: true,
    },
    unit: {
      type: String,
      enum: ['Bytes', 'KB', 'MB', 'GB']
      // required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ext: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // This will add createdAt and updatedAt fields
  }
)

const Resource = mongoose.model('Resource', resourceSchema)
export default Resource
