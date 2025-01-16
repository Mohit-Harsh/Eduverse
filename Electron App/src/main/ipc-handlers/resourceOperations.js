import { ipcMain, dialog, shell } from 'electron'
import { DriveUploadManager } from './drive'
import { BrowserWindow } from 'electron/main'

const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uris: ['http://localhost']
}

let manager = new DriveUploadManager(credentials)

function setupResourceOperations() {
  ipcMain.handle('upload-file', async (event, req) => {
    try {
      console.log(manager)
      if (!((await manager.loadUser()) && (await manager.checkAndRefreshTokens()))) {
        // Start auth flow if no valid tokens
        await manager.startAuthFlow()
      }

      const result = await manager.uploadFile(req)

      if (result.success) {
        return {
          status: true,
          fileId: result.fileId,
          name: result.name,
          shareableLink: result.shareableLink,
          type: result.type,
          size: result.size,
          date: result.date
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      return {
        status: false,
        error: error.message
      }
    }
  })

  ipcMain.handle('get-resources', async (event) => {
    try {
      if (!((await manager.loadUser()) && (await manager.checkAndRefreshTokens()))) {
        await manager.startAuthFlow()
      }
      const res = await manager.getUserResources()
      return res
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  })

  ipcMain.handle('delete-resource', async (event, resource) => {
    let confirmation = dialog.showMessageBoxSync(null, {
      type: 'question',
      buttons: ['No', 'Yes'],
      defaultId: 0,
      title: 'Delete Resource?',
      message: 'Are you sure you want to delete this resource?'
    })

    if (confirmation) {
      try {
        await manager.deleteResource(resource.id)
      } catch {
        dialog.showMessageBoxSync(null, {
          type: 'error',
          title: 'Error',
          message: 'An unexpected error occured while deleting the file.'
        })
        return false
      }
      dialog.showMessageBoxSync(null, {
        type: 'info',
        title: 'Deleted',
        message: `${resource.name} deleted successfully`
      })
      return true
    }
    return false
  })

  ipcMain.handle('open-file', (event, url) => {
    const newWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })

    newWindow.loadURL(url) // Open the link in the new window
  })
}

export default setupResourceOperations
