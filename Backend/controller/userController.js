const User = require("../models/user");

class UserController {
  // Create a new user
  async createUser(req, res) {
    try {
      const user = new User(req.body);
      await user.save();

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get single user
  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      if (user.id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "User not authorized to update",
        });
      }
      if (req.body.name) {
        user.name = req.body.name;
      }
      await user.save();

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }
      if (user.id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "User not authorized to update",
        });
      }
      await user.remove();

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
