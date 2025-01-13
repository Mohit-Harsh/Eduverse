const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const driveUploadManager = require("./drive");

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];
let mainWindow;

const TOKEN_PATH = path.join(
  process.env.APPDATA || process.env.HOME,
  ".gdrive-tokens.json"
);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  console.log(TOKEN_PATH);
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.on("ready", async () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//

const manager = new driveUploadManager(credentials);

// Main process handler
ipcMain.handle("upload-file", async (event, name, filePath, filesize) => {
  try {
    // Check for valid tokens
    if (
      !((await manager.checkAndRefreshTokens()) && (await manager.loadUser()))
    ) {
      // Start auth flow if no valid tokens
      await manager.startAuthFlow();
    }

    // Upload file and get shareable link
    const result = await manager.uploadFile(name, filePath, filesize);

    if (result.success) {
      return {
        success: true,
        fileId: result.fileId,
        name: result.name,
        shareableLink: result.shareableLink,
      };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});
