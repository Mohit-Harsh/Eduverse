import styles from './ProjectPage.module.css'
import roadmap from './esd.json'
import folder from '../../assets/folder.png'
import attach from '../../assets/attach.png'
import qb from '../../assets/question_bank.png'
import syllabus from '../../assets/syllabus.png'
import { Link, NavLink } from 'react-router'
import { Navigate } from 'react-router'
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from 'react-router'
import projects from './projects.json'
import filterIcon from '../../assets/filter.png'
import sortIcon from '../../assets/sort.png'
import hideIcon from '../../assets/hide.png'
import dotIcon from '../../assets/dots.png'
import plusIcon from '../../assets/plus_white.png'
import editIcon from '../../assets/edit.png'
import addlink from '../../assets/addlink.png'
import topiclink from '../../assets/topiclink.png'
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import * as themes from '../MuiTooltipTheme.js';
import Navbar from '../Navbar/Navbar.jsx'
import { Outlet } from 'react-router'
 
export default function ProjectPage()
{

    let courseName = "Embedded System Design"
    
    const status = {"not-started":'var(--red)','in-progress':'var(--yellow)','completed':'var(--green)'};

    const theme = themes.theme;

    return(
        <>
        <div className={styles.container}>
            
            <Navbar></Navbar>
            
            <div className={styles.maindiv}>

                <div className={styles.header}>

                    <div>
                        <button className={styles.btn}><img src={filterIcon} alt="" /><span>Filter</span></button>
                        <button className={styles.btn}><img src={sortIcon} alt="" /><span>Sort</span></button>
                        <button className={styles.btn}><img src={hideIcon} alt="" /><span>Hide</span></button>
                        <button className={styles.btn}><img src={dotIcon} alt="" /></button>
                    </div>
                    
                    <button className={styles.new}><img src={plusIcon} alt="" /><span>New Project</span></button>

                </div>

                <div className={styles.body}>

                    {projects.map((item,key)=>
                    
                    <div key={key}>

                        <div className={styles.date}>
                            <p>{item.date}</p>
                        </div>
                        {item.projects.map((project,k)=>
                        <div key={k} className={styles.card}>

                            <div className={styles.col1}>

                             <ThemeProvider theme={theme}><Tooltip arrow title="Edit Project" placement='top'><button style={{cursor:'pointer'}}><img src={editIcon} alt="" /></button></Tooltip></ThemeProvider>
                             <ThemeProvider theme={theme}><Tooltip title={project.title} placement='top'><p title={project.title}>{project.title}</p></Tooltip></ThemeProvider>

                            </div>
                            <div className={styles.col2}>

                                <ThemeProvider theme={theme}><Tooltip arrow title='Resources' placement='top'><span style={{cursor:'pointer'}}><img src={addlink} alt="" />{project.resources}</span></Tooltip></ThemeProvider>
                                <ThemeProvider theme={theme}><Tooltip arrow title='Topics' placement='top'><span style={{cursor:'pointer'}}><img src={topiclink} alt="" />{project.topics}</span></Tooltip></ThemeProvider>
                                <p style={{backgroundColor:status[project.status]}}>{project.status}</p>
                                <Link to={`${project.title}`} state={{course:`${project.title}`}}><button className={styles.openbtn}>Open</button></Link>

                            </div>

                        </div>)}

                    </div>
                    
                    )}

                </div>

            </div>
            

        </div>  
        </>
    )
}