import { ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path/posix'

function setupRoadmapOperations() {
  ipcMain.handle('get-roadmap', async (event, dir) => {
    try {
      let roadmapPath = join(dir, 'roadmap.json')
      if (!fs.existsSync(roadmapPath)) {
        fs.writeFileSync(roadmapPath, JSON.stringify([]), 'utf-8')
        return { roadmap: [], status: true }
      }
      let roadmap = JSON.parse(fs.readFileSync(roadmapPath))
      return { roadmap: roadmap, status: true }
    } catch {
      return { status: false }
    }
  })

  ipcMain.handle('save-roadmap', async (event, request) => {
    try {
      fs.writeFileSync(join(request[1], 'roadmap.json'), JSON.stringify(request[0]), 'utf8')
      await dialog.showMessageBoxSync(null, {
        type: 'info',
        buttons: ['Ok'],
        defaultId: 0,
        title: 'Roadmap Saved',
        message: 'Roadmap has been saved successfully'
      })
      return true
    } catch {
      await dialog.showMessageBoxSync(null, {
        type: 'error',
        title: 'Failed',
        message: 'Error occured while saving roadmap.'
      })
      return false
    }
  })

  ipcMain.handle('delete-topic', async (event, { new_roadmap, tid, dir }) => {
    try {
      const confirmation = await dialog.showMessageBoxSync(null, {
        type: 'question',
        buttons: ['No', 'Yes'],
        defaultId: 0,
        title: 'Delete Topic',
        message:
          'Do you really want to delete this topic? All the topic resources will also be deleted.'
      })

      if (fs.existsSync(join(dir, 'Resources', tid))) {
        fs.rmSync(join(dir, 'Resources', tid), { recursive: true, force: true })
      }

      const roadmapPath = join(dir, 'roadmap.json')

      fs.writeFileSync(roadmapPath, JSON.stringify(new_roadmap), 'utf-8')

      return true
    } catch (err) {
      dialog.showMessageBoxSync(null, {
        type: 'error',
        title: 'Error Deleting Topic',
        message: err.message
      })
      return false
    }
  })

  ipcMain.handle('create-module', (event, { new_roadmap, dir }) => {
    try {
      fs.writeFileSync(join(dir, 'roadmap.json'), JSON.stringify(new_roadmap), 'utf-8')
      return true
    } catch (err) {
      dialog.showMessageBoxSync(null, {
        type: 'error',
        title: 'Error Creating Module',
        message: err.message
      })
      return false
    }
  })

  ipcMain.handle('delete-module', async (event, { roadmap, index, dir }) => {
    try {
      const res = await dialog.showMessageBoxSync(null, {
        type: 'question',
        buttons: ['No', 'Yes'],
        defaultId: 0,
        title: 'Delete Module',
        message:
          'Do you really want to delete this module? All module resources will also be deleted.'
      })

      console.log(roadmap[index])

      if (res) {
        if (fs.existsSync(join(dir, 'Resources', roadmap[index].mid))) {
          fs.rmSync(join(dir, 'Resources', roadmap[index].mid), { recursive: true, force: true })
        }

        roadmap[index].Topics.Easy.forEach((item) => {
          if (fs.existsSync(join(dir, 'Resources', item.tid))) {
            fs.rmSync(join(dir, 'Resources', item.tid), { recursive: true, force: true })
          }
        })

        roadmap[index].Topics.Medium.forEach((item) => {
          if (fs.existsSync(join(dir, 'Resources', item.tid))) {
            fs.rmSync(join(dir, 'Resources', item.tid), { recursive: true, force: true })
          }
        })

        roadmap[index].Topics.Medium.forEach((item) => {
          if (fs.existsSync(join(dir, 'Resources', item.tid))) {
            fs.rmSync(join(dir, 'Resources', item.tid), { recursive: true, force: true })
          }
        })

        let new_roadmap = [...roadmap]
        new_roadmap = new_roadmap.slice(0, index).concat(new_roadmap.slice(index + 1))

        fs.writeFileSync(join(dir, 'roadmap.json'), JSON.stringify(new_roadmap), 'utf-8')

        return true
      }
    } catch (err) {
      dialog.showMessageBoxSync(null, {
        type: 'error',
        title: 'Error Deleting Module',
        message: err.message
      })
      return false
    }
  })

  ipcMain.handle('add-topic', async (event, { new_roadmap, dir }) => {
    try {
      fs.writeFileSync(join(dir, 'roadmap.json'), JSON.stringify(new_roadmap), 'utf8')
      return true
    } catch (err) {
      await dialog.showMessageBoxSync(null, {
        type: 'error',
        title: 'Cannot Create Topic',
        message: err.message
      })
      return false
    }
  })
}

export default setupRoadmapOperations
