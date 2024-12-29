import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router";
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import Roadmap from './components/Roadmap/Roadmap.jsx';
import './App.css'
import ProjectPage from './components/Projects/ProjectPage.jsx';
import ProjectRoadmap from './components/Projects/ProjectRoadmap.jsx';
import LoginPage from './components/Login/LoginPage.jsx';
import creds from '../../credentials.json';



function App() {

  const [credentials,setCredentials] = useState(undefined);

  // if(!credentials)
  // {
  //   return(<>
  //     <Routes>
  //       <Route path='/' element={<LoginPage clientId={creds.web.client_id} setCredentials={setCredentials}/>}></Route>
  //     </Routes>
  //   </>)
  // }
  // else

  return (
    <>
    <div style={{display:'flex'}}>
      <div className='nav' style={{height:'100vh'}}>
          <Sidebar/>
      </div>
      <div className='maindiv' style={{height:'100vh'}}>
      
        <Routes>
          <Route path='' element={<Navigate to='/course' />}/>
          <Route path='course' element={<ProjectPage/>}></Route>
          <Route path='course/:coursename' element={<ProjectRoadmap/>}/>
        </Routes>

      </div>
    </div>
    </>
  )}

export default App
