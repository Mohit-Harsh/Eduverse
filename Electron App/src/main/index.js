import { app, shell, BrowserWindow, ipcMain, utilityProcess, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {months} from '../renderer/src/months.js';
import setupProjectOperations from './ipc-handlers/projectOperations.js';
import setupRoadmapOperations from './ipc-handlers/roadmapOperations.js';
import setupResourceOperations from './ipc-handlers/resourceOperations.js';
import setupOpenAI from './ipc-handlers/openai.js';
import setupRecommendations from './ipc-handlers/recommendations.js';

const fs = require('fs');
const path = require('path');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth:600,
    minHeight:400,
    show: false,
    // autoHideMenuBar:true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  const splash = new BrowserWindow({
    width: 600,
    height:400,
    show:true,
    frame:false,
    alwaysOnTop:true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  splash.loadFile('resources/splash.html');

  mainWindow.webContents.on("did-finish-load",()=>{
    setTimeout(()=>{
      splash.destroy();
      mainWindow.maximize();
    },3000);
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Handlers

  setupProjectOperations();

  setupRoadmapOperations();

  setupResourceOperations();

  setupOpenAI();

  setupRecommendations();

})
