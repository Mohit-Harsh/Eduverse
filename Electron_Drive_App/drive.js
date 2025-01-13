const { BrowserWindow } = require("electron");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const http = require("http");
const database = require("./database/database");
const User = require("./database/user");
const Resource = require("./database/resource");

// Constants
// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const TOKEN_PATH = path.join(
  process.env.APPDATA || process.env.HOME,
  ".gdrive-tokens.json"
);

const USER_PATH = path.join(
  process.env.APPDATA || process.env.HOME,
  "user.json"
);

class DriveUploadManager {
  constructor(credentials) {
    this.auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );

    this.user = null;
    this.drive = null;
    this.authWindow = null;
    this.server = null;
  }

  // Load tokens from file
  loadTokens() {
    try {
      if (fs.existsSync(TOKEN_PATH)) {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
        this.auth.setCredentials(tokens);
        return true;
      }
    } catch (error) {
      console.error("Error loading tokens:", error);
    }
    return false;
  }

  loadUser() {
    try {
      if (fs.existsSync(USER_PATH)) {
        const user = JSON.parse(fs.readFileSync(USER_PATH));
        this.user = user;
        return true;
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    return false;
  }

  // Save tokens to file
  saveTokens(tokens) {
    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  }

  saveUser(user) {
    try {
      fs.writeFileSync(USER_PATH, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  // Check if tokens are expired and refresh if needed
  async checkAndRefreshTokens() {
    if (!this.loadTokens()) return false;

    const tokens = this.auth.credentials;
    const expiryDate = tokens.expiry_date;
    const isExpired = expiryDate ? expiryDate <= Date.now() : true;

    if (isExpired && tokens.refresh_token) {
      try {
        const response = await this.auth.refreshToken(tokens.refresh_token);
        this.saveTokens(response.tokens);
        return true;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
      }
    }

    return !isExpired;
  }

  // Start authentication flow in a new window
  async startAuthFlow() {
    return new Promise((resolve, reject) => {
      // Generate auth URL
      const authUrl = this.auth.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent", // Force consent screen to ensure getting refresh token
      });

      // Create auth window
      this.authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
        },
      });

      // Start local server to handle callback
      this.server = http
        .createServer(async (req, res) => {
          if (req.url.includes("code=")) {
            const code = new URLSearchParams(req.url.split("?")[1]).get("code");

            try {
              const { tokens } = await this.auth.getToken(code);
              this.auth.setCredentials(tokens);
              var oauth2 = google.oauth2({
                auth: this.auth,
                version: "v2",
              });

              await database.connect();

              const info = await oauth2.userinfo.get({});

              let user = await User.findOne({ email: info.data.email });

              if (!user) {
                user = new User({
                  name: info.data.name,
                  email: info.data.email,
                });
                await user.save();
              }

              this.user = user;

              this.saveUser(user);

              this.saveTokens(tokens);

              await database.disconnect();

              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(
                "<h1>Authentication successful!</h1><p>You can close this window now.</p>"
              );

              if (this.authWindow) {
                this.authWindow.close();
                this.authWindow = null;
              }

              this.server.close();
              resolve(true);
            } catch (error) {
              reject(error);
            }
          }
        })
        .listen(80);

      // Load auth URL
      this.authWindow.loadURL(authUrl);

      // Handle window close
      this.authWindow.on("closed", () => {
        this.authWindow = null;
        if (this.server) {
          this.server.close();
          reject(new Error("Authentication window was closed"));
        }
      });
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return { size: 0, unit: "Bytes" };
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return {
      size: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
      unit: sizes[i],
    };
  }

  // Upload file and get shareable link
  async uploadFile(name, filePath, filesize) {
    try {
      // Initialize drive client
      this.drive = google.drive({ version: "v3", auth: this.auth });

      const fileMetadata = {
        name: path.basename(filePath),
      };

      const media = {
        mimeType: this.getMimeType(filePath),
        body: fs.createReadStream(filePath),
      };

      database.connect();

      // Upload file
      const file = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id, webViewLink",
      });

      // Update file permissions to make it shareable
      await this.drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const { size, unit } = this.formatFileSize(filesize);
      const resource = new Resource({
        name: name,
        size: size,
        unit: unit,
        drive_link: file.data.webViewLink,
        createdBy: this.user._id,
        ext: path.extname(filePath).toLowerCase(),
      });
      await resource.save();
      const user = await User.findById(this.user._id);
      user.resources.push(resource.id);
      await user.save();
      this.user = user;
      database.disconnect();

      return {
        success: true,
        fileId: file.data.id,
        name: name,
        shareableLink: file.data.webViewLink,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".txt": "text/plain",
      ".jpg": "image/jpeg",
      ".png": "image/png",
    };
    return mimeTypes[extension] || "application/octet-stream";
  }
}

module.exports = DriveUploadManager;
