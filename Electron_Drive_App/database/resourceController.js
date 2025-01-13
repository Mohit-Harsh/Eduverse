const Resource = require("../models/Resource");
const User = require("../models/User");

const resourceController = {
  // Create a new resource
  createResource: async (req, res) => {
    try {
      const user = await User.findById(req.body.createdBy);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resource = new Resource(req.body);
      await resource.save();

      user.resources.push(resource._id);
      await user.save();

      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all resource
  getAllResource: async (req, res) => {
    try {
      const resource = await Resource.find().populate(
        "createdBy",
        "name email"
      );
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single resource by ID
  getResourceById: async (req, res) => {
    try {
      const resource = await Resource.findById(req.params.id).populate(
        "createdBy",
        "name email"
      );
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get resource by user ID
  getResourceByUser: async (req, res) => {
    try {
      const resource = await Resource.find({
        createdBy: req.params.userId,
      }).populate("createdBy", "name email");
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a resource
  updateResource: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "drive_link", "size"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }

    try {
      const resource = await Resource.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      updates.forEach((update) => (resource[update] = req.body[update]));
      await resource.save();
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a resource
  deleteResource: async (req, res) => {
    try {
      const resource = await Resource.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Remove resource reference from user
      await User.findByIdAndUpdate(resource.createdBy, {
        $pull: { resource: resource._id },
      });

      await resource.deleteOne();
      res.json({ message: "Resource deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = resourceController;
