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

    function getStatus(project)
    {
        console.log(project);
        return "not-started";
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

                                <Link to={`${project.title}`} state={{course:project.title,dir:project.dirPath}}><button className={styles.openbtn}>Open</button></Link>
                                <button className={styles.deletebtn} onClick={()=>handleDelete(item,k)}>Delete</button>

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
