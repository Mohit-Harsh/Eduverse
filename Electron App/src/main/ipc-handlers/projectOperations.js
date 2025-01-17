import { ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path/posix'
import { months } from '../../renderer/src/months'

function setupProjectOperations() {
  const dirPath = path.join(process.env.APPDATA, 'Eduverse')
  const filePath = path.join(dirPath, 'projects.json')

  // Function to ensure directory and file exist
  function ensureFileExists() {
    // Check if the directory exists
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist. Creating: ${dirPath}`)
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      const defaultContent = JSON.stringify({})
      fs.writeFileSync(filePath, defaultContent, 'utf-8')
    }
  }

  // Function to read the file
  function readFile() {
    try {
      ensureFileExists()
      const data = fs.readFileSync(filePath, 'utf-8')
      return data
    } catch (error) {
      return null
    }
  }

  ipcMain.handle('getProjectsJson', async () => {
    let res = await readFile()
    return res
  })

  ipcMain.handle('create-project', async (event, request) => {
    const result = await dialog.showOpenDialog(null, {
      message: 'Choose Destination Folder',
      properties: ['openDirectory']
    })

    let dir = join(result.filePaths[0], request.title)

    if (fs.existsSync(dir)) {
      return { status: false }
    }

    fs.mkdirSync(dir, { recursive: true })
    fs.mkdirSync(join(dir, 'Resources'), { recursive: true })

    let new_project = {
      title: request.title,
      description: request.description,
      topics: 0,
      resources: 0,
      syllabus: request.syllabus,
      status: 'not-started',
      dirPath: dir
    }

    fs.writeFileSync(join(dir, 'roadmap.json'), JSON.stringify([]), 'utf-8')

    let projectList = await readFile()
    projectList = JSON.parse(projectList)

    let d = new Date()

    let key = `${months[d.getMonth()]}, ${d.getFullYear()}`

    if (Object.keys(projectList).includes(key)) {
      projectList[key].push(new_project)
    } else {
      projectList[key] = [new_project]
    }

    fs.writeFileSync(filePath, JSON.stringify(projectList), 'utf-8')
    const data = fs.readFileSync(filePath, 'utf-8')
    return { data: data, status: true }
  })

  ipcMain.handle('delete-project', async (event, request) => {
    try {
      let confirmation = await dialog.showMessageBoxSync(null, {
        type: 'question',
        buttons: ['No', 'Yes'],
        defaultId: 0,
        title: 'Delete Project?',
        message: 'Are you sure you want to delete this project.'
      })

      if (confirmation) {
        let current = await readFile()

        current = JSON.parse(current)

        fs.rmSync(current[request[1]][request[2]]['dirPath'], { recursive: true, force: true })
        fs.writeFileSync(filePath, JSON.stringify(request[0]))

        return true
      } else {
        return false
      }
    } catch {
      return false
    }
  })
}

export default setupProjectOperations
