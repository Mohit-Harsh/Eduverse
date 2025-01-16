import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  createProject: (req) => ipcRenderer.invoke('create-project', req),
  deleteProject: (req) => ipcRenderer.invoke('delete-project', req),
  uploadFile: (req) => ipcRenderer.invoke('upload-file', req),
  getRoadmap: (req) => ipcRenderer.invoke('get-roadmap', req),
  saveRoadmap: (req) => ipcRenderer.invoke('save-roadmap', req),
  getResources: (req) => ipcRenderer.invoke('get-resources', req),
  deleteResource: (req) => ipcRenderer.invoke('delete-resource', req),
  openFile: (req) => ipcRenderer.invoke('open-file', req),
  deleteTopic: ({ new_roadmap, tid, dir }) =>
    ipcRenderer.invoke('delete-topic', { new_roadmap, tid, dir }),
  createModule: ({ new_roadmap, dir }) => ipcRenderer.invoke('create-module', { new_roadmap, dir }),
  deleteModule: ({ roadmap, index, dir }) =>
    ipcRenderer.invoke('delete-module', { roadmap, index, dir }),
  addTopic: ({ new_roadmap, dir }) => ipcRenderer.invoke('add-topic', { new_roadmap, dir }),
  windowReload: () => ipcRenderer.invoke('reload-window')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
