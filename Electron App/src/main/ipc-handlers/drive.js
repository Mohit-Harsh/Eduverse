const { BrowserWindow } = require('electron')
const { google } = require('googleapis')
const path = require('path')
const fs = require('fs')
const http = require('http')

import Database from '../database/database'
import User from '../database/user'
import Resource from '../database/resource'
import { redirect } from 'react-router'

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
]

const TOKEN_PATH = 'C:/Users/mohit/AppData/Roaming/Eduverse/.gdrive-tokens.json'

const USER_PATH = 'C:/Users/mohit/AppData/Roaming/Eduverse/user.json'

class DriveUploadManager {
  constructor(credentials) {
    this.auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    )

    this.user = null
    this.drive = null
    this.authWindow = null
    this.server = null
    this.database = new Database()
  }

  // Load tokens from file
  loadTokens() {
    try {
      if (fs.existsSync(TOKEN_PATH)) {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH))
        this.auth.setCredentials(tokens)
        return true
      }
    } catch (error) {
      console.error('Error loading tokens:', error)
    }
    return false
  }

  loadUser() {
    console.log(USER_PATH)
    try {
      if (fs.existsSync(USER_PATH)) {
        const user = JSON.parse(fs.readFileSync(USER_PATH))
        this.user = user
        return true
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
    return false
  }

  // Save tokens to file
  saveTokens(tokens) {
    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
    } catch (error) {
      console.error('Error saving tokens:', error)
    }
  }

  saveUser(user) {
    try {
      fs.writeFileSync(USER_PATH, JSON.stringify(user))
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  async checkAndRefreshTokens() {
    if (!this.loadTokens()) return false

    const tokens = this.auth.credentials
    const expiryDate = tokens.expiry_date
    const isExpired = expiryDate ? expiryDate <= Date.now() : true

    if (isExpired && tokens.refresh_token) {
      try {
        const response = await this.auth.refreshToken(tokens.refresh_token)
        this.saveTokens(response.tokens)
        return true
      } catch (error) {
        console.error('Error refreshing token:', error)
        return false
      }
    }

    return !isExpired
  }

  // Start authentication flow in a new window
  async startAuthFlow() {
    return new Promise((resolve, reject) => {
      // Generate auth URL
      const authUrl = this.auth.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
      })

      // Create auth window
      this.authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false
        }
      })

      // Start local server to handle callback
      this.server = http
        .createServer(async (req, res) => {
          if (req.url.includes('code=')) {
            const code = new URLSearchParams(req.url.split('?')[1]).get('code')

            try {
              const { tokens } = await this.auth.getToken(code)
              this.auth.setCredentials(tokens)
              var oauth2 = google.oauth2({
                auth: this.auth,
                version: 'v2'
              })

              await this.database.connect()

              const info = await oauth2.userinfo.get({})

              let user = await User.findOne({ email: info.data.email })

              if (!user) {
                user = new User({
                  name: info.data.name,
                  email: info.data.email
                })
                await user.save()
              }

              this.user = user

              this.saveUser(user)

              this.saveTokens(tokens)

              await this.database.disconnect()

              res.writeHead(200, { 'Content-Type': 'text/html' })
              res.end('<h1>Authentication successful!</h1><p>You can close this window now.</p>')

              if (this.authWindow) {
                this.authWindow.close()
                this.authWindow = null
              }

              this.server.close()
              redirect('./')
              resolve(true)
            } catch (error) {
              reject(error)
            }
          }
        })
        .listen(80)

      // Load auth URL
      this.authWindow.loadURL(authUrl)

      // Handle window close
      this.authWindow.on('closed', () => {
        this.authWindow = null
        if (this.server) {
          this.server.close()
          reject(new Error('Authentication window was closed'))
        }
      })
    })
  }

  formatFileSize(bytes) {
    if (bytes === 0) return { size: 0, unit: 'Bytes' }
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return {
      size: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
      unit: sizes[i]
    }
  }

  // Upload file and get shareable link
  async uploadFile(req) {
    this.drive = google.drive({ version: 'v3', auth: this.auth })

    try {
      if (req.mode) {
        const fileMetadata = {
          name: path.basename(req.data.location)
        }

        const media = {
          mimeType: this.getMimeType(req.data.location),
          body: fs.createReadStream(req.data.location)
        }

        this.database.connect()

        // Upload file
        const file = await this.drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id, webViewLink'
        })

        // Update file permissions to make it shareable
        await this.drive.permissions.create({
          fileId: file.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        })
        const { size, unit } = this.formatFileSize(req.data.size)
        const resource = new Resource({
          name: req.data.name,
          size: size,
          unit: unit,
          drive_link: file.data.webViewLink,
          createdBy: this.user._id,
          ext: path.extname(req.data.location).toLowerCase()
        })

        await resource.save()
        const user = await User.findById(this.user._id)
        user.resources.push(resource.id)
        await user.save()
        this.user = user
        this.database.disconnect()

        return {
          success: true,
          fileId: resource.id,
          name: req.data.name,
          shareableLink: file.data.webViewLink,
          type: resource.ext,
          size: resource.size + ' ' + resource.unit,
          date: resource.createdAt
        }
      } else {
        this.database.connect()
        const fileId = req.link.split('/d/')[1].split('/')[0] // Extract file ID

        const res = await this.drive.files.get({
          fileId: fileId,
          fields: 'name, mimeType, size, modifiedTime, createdTime'
        })
        const { size, unit } = this.formatFileSize(req.data.size)

        const fileMetadata = res.data
        const resource = new Resource({
          name: req.data.name,
          drive_link: req.data.link,
          createdBy: this.user._id,
          ext: this.getFileExtension(fileMetadata.mimeType),
          size: size,
          unit: unit
        })

        await resource.save()
        const user = await User.findById(this.user._id)
        user.resources.push(resource.id)
        await user.save()
        this.user = user
        this.database.disconnect()

        return {
          success: true,
          fileId: resource.id,
          name: resource.name,
          drive_link: resource.drive_link,
          type: resource.ext,
          date: resource.createdAt,
          size: resource.size + ' ' + resource.unit
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  getMimeType(filePath) {
    const extension = path.extname(filePath).toLowerCase()
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.png': 'image/png'
    }
    return mimeTypes[extension] || 'application/octet-stream'
  }
  getFileExtension(mimeType) {
    const mimeTypes = {
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'text/plain': '.txt',
      'image/jpeg': '.jpg',
      'image/png': '.png'
    }

    return mimeTypes[mimeType] || '' // Returns empty string if MIME type is not found
  }

  async getUserResources() {
    try {
      await this.database.connect()

      // Find the user and populate their resources
      const user = await User.findById(this.user._id).populate('resources')

      if (!user) {
        this.startAuthFlow()
        throw new Error('User not found')
      }

      const serializedResources = user.resources.map((resource) => ({
        id: resource._id.toString(),
        name: resource.name,
        size: resource.size + ' ' + resource.unit,
        drive_link: resource.drive_link,
        ext: resource.ext,
        date: resource.createdAt,
        type: resource.ext // Remove the dot and uppercase
      }))

      await this.database.disconnect()

      return {
        success: true,
        resources: serializedResources
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Delete a specific resource by ID
  async deleteResource(resourceId) {
    console.log(resourceId)
    let isConnected = false
    try {
      await this.database.connect()
      isConnected = true

      // Find and verify resource
      const resource = await Resource.findById(resourceId)
      if (!resource) {
        throw new Error('Resource not found')
      }
      console.log(resource)

      // Verify ownership
      if (resource.createdBy.toString() !== this.user._id.toString()) {
        throw new Error('Unauthorized: Resource does not belong to current user')
      }

      // Setup drive if needed
      if (!this.drive) {
        this.drive = google.drive({ version: 'v3', auth: this.auth })
      }

      // Delete from Google Drive
      try {
        const fileId = this.extractFileIdFromUrl(resource.drive_link)
        await this.drive.files.delete({ fileId: fileId })
      } catch (driveError) {
        console.error('Error deleting from Drive:', driveError)
        // Continue with database cleanup even if Drive deletion fails
      }

      // Update user document first
      // const updatedUser = await User.findOneAndUpdate(
      //   { _id: this.user._id },
      //   { $pull: { resources: resourceId } },
      //   { new: true, session: this.database.connect() }
      // )

      // if (!updatedUser) {
      //   throw new Error('Failed to update user document')
      // }

      // Delete resource document
      // const deletedResource = await Resource.findByIdAndDelete(resourceId)
      // if (!deletedResource) {
      //   throw new Error('Failed to delete resource document')
      // }
      await resource.deleteOne()
      const updatedUser = await User.findById(this.user._id)

      updatedUser.resources = [...this.user.resources].filter((item) => item != resource._id)
      console.log(updatedUser)

      // Update local user object
      this.user = await updatedUser.save()

      await this.database.disconnect()
      isConnected = false

      return {
        success: true,
        message: 'Resource deleted successfully'
      }
    } catch (error) {
      console.error('Delete resource error:', error)
      if (isConnected) {
        await this.database.disconnect()
      }
      return {
        success: false,
        error: error.message || 'Failed to delete resource'
      }
    }
  }

  // Helper method to extract file ID from Google Drive URL
  extractFileIdFromUrl(url) {
    const matches = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)
    if (!matches) {
      throw new Error('Invalid Google Drive URL')
    }
    return matches[0]
  }
}

export { DriveUploadManager }
