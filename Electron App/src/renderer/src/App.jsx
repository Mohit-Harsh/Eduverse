import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import './App.css'
import ProjectPage from './components/Projects/ProjectPage.jsx'
import ProjectRoadmap from './components/Projects/ProjectRoadmap.jsx'
import * as React from 'react'
import ResourcePage from './components/Resources/ResourcePage.jsx'
import AllResources from './components/Resources/AllResources.jsx'
import ErrorPage from './components/Errors/ErrorPage.jsx'

function App() {
  const [projects, setProjects] = useState(undefined)

  useEffect(() => {
    document.documentElement.setAttribute('theme-mode', 'dark')

    async function getData() {
      console.log('Fetch Projects')
      let data = await window.electron.ipcRenderer.invoke('getProjectsJson')
      setProjects(JSON.parse(data))
    }

    getData()
  }, [])

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="nav" style={{ height: '100vh' }}>
          <Sidebar />
        </div>

        <div className="maindiv" style={{ height: '100vh' }}>
          <Routes>
            <Route path="" element={<Navigate to="/course" />} />
            <Route
              path="course"
              element={<ProjectPage projects={projects} setProjects={setProjects} />}
            ></Route>
            <Route path="course/:coursename" element={<ProjectRoadmap />} />
            <Route path="resources" element={<AllResources />} />
            <Route path="resources/:coursename" element={<ResourcePage />} />
            <Route path="error/:errorname" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
