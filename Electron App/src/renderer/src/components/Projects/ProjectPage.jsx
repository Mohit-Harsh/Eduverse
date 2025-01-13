import styles from './ProjectPage.module.css';
import { Link } from 'react-router';
import Tooltip from "@mui/material/Tooltip";
import {  ThemeProvider } from "@mui/material/styles";
import {theme} from '../MuiTooltipTheme.js';
import Navbar from '../Navbar/Navbar.jsx';
import CourseForm from '../Forms/CourseForm.jsx';
import * as React from 'react';
import NoFiles from '../Errors/NoFiles.jsx';

export default function ProjectPage({projects,setProjects})
{
    console.log(projects)

    const status = {"not-started":'var(--red)','in-progress':'var(--yellow)','completed':'var(--green)'};

    function handleClick()
    {
        let form = document.getElementById("courseForm");
        form.style.setProperty("display","flex");
    }

    async function handleDelete(date,index)
    {
        
        let new_projects = {...projects};
        new_projects[date] = (new_projects[date].slice(0,index)).concat(new_projects[date].slice(index+1));
        
        if(new_projects[date].length == 0)
        {
            delete new_projects[date];
        }

        let res = await window.api.deleteProject([new_projects,date,index]);

        if(res == true)
            setProjects(new_projects);
        
    }

    if(projects != undefined)
    
    return(
        <>
        <div className={styles.container}>
            
            <Navbar></Navbar>

            <CourseForm setProjects={setProjects}></CourseForm>
            
            <div className={styles.maindiv}>

                <div className={styles.header}>

                    <div>
                        <div className={styles.searchDiv}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                            </svg>
                            <input className={styles.searchInput} type="text" />
                        </div>
                        <button className={styles.btn}><svg style={{fill:"var(--svgFill)"}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"/>
                        </svg><span>Filter</span></button>
                        <button className={styles.btn}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/>
                        </svg><span>Sort</span></button>
                    </div>
                    
                    <button className={styles.new} onClick={handleClick}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/></svg><span>New Project</span></button>

                </div>

                <div className={styles.body}>

                    {(Object.keys(projects).length>0)?Object.keys(projects).map((item,key)=>
                    
                    <div key={key}>

                        <div className={styles.date}>
                            <p>{item}</p>
                        </div>
                        {projects[item].map((project,k)=>
                        <div key={k} className={styles.card}>

                            <div className={styles.col1}>

                             <ThemeProvider theme={theme}><Tooltip arrow title="Edit Project" placement='top'><button style={{cursor:'pointer'}}><svg style={{stroke:"var(--svgStroke)"}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill='none'><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/></svg></button></Tooltip></ThemeProvider>
                             <ThemeProvider theme={theme}><Tooltip title={project.title} placement='top'><p>{project.title}</p></Tooltip></ThemeProvider>

                            </div>
                            <div className={styles.col2}>

                                <ThemeProvider theme={theme}><Tooltip arrow title='Resources' placement='top'><span style={{cursor:'pointer'}}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"/></svg>{project.resources}</span></Tooltip></ThemeProvider>
                                <ThemeProvider theme={theme}><Tooltip arrow title='Topics' placement='top'><span style={{cursor:'pointer'}}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" fill='none'/></svg>{project.topics}</span></Tooltip></ThemeProvider>
                                <p style={{backgroundColor:status[project.status]}}>{project.status}</p>
                                <Link to={`${project.title}`} state={{course:project.title,dir:project.dirPath}}><button className={styles.openbtn}>Open</button></Link>
                                <ThemeProvider theme={theme}><Tooltip title="Delete" placement='top' arrow><button className={styles.deletebtn} onClick={()=>handleDelete(item,k)}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/></svg>
                                </button></Tooltip></ThemeProvider>

                            </div>

                        </div>)}

                    </div>
                    
                    ):<NoFiles title={"No Existing Projects"} msg={"Click on New Project button to create a project."}/>}
                </div>

            </div>
            

        </div>  
        </>
    )
}
