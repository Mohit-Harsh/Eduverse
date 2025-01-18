import styles from './CourseForm.module.css';
import * as React from 'react';
import { CircularProgress } from '@mui/material';

export default function CourseForm({setProjects})
{

    const [check,setCheck] = React.useState(false);

    console.log(Date.now());

    function handleClose()
    {
        let form = document.getElementById("courseForm");
        form.style.setProperty("display","none");
    }

    async function handleSubmit(event)
    {
        document.getElementById('submitBtn').style.setProperty('display','none');
        document.getElementById('circularProgress').style.setProperty('display','flex');

        event.preventDefault();
        console.log(event.target);
        let form = document.getElementById("courseForm");
        let t = document.getElementById('title').value;
        let d = document.getElementById('description').value;

        let content = [];

        if(check)
        {
            content = await window.api.createAIRoadmap(document.getElementById('syllabus').value);
        }
        
        let res = await window.api.createProject({title:t,description:d,roadmap:content});

        document.getElementById('submitBtn').style.setProperty('display','flex');
        document.getElementById('circularProgress').style.setProperty('display','none');
        
        if(res.status == true)
        {
            form.style.setProperty("display","none");
            setProjects(JSON.parse(res.data));
        }
        
    }

    return(
        <>

            <div id='courseForm' className={styles.container} style={{position:'absolute',display:'none',
            flexDirection:'column',rowGap:'30px',justifyContent:'center',
            height:'fit-content',boxSizing:'border-box',backgroundColor:"var(--formBackground)",border:"1px solid var(--border)",borderRadius:'10px',
            boxShadow:'0px 2px 8px 4px var(--shadowColor)'}}>

                <div style={{display:'flex',alignItems:"center",justifyContent:'end',width:'100%'}}>
                    <button className={styles.close} onClick={handleClose}><svg className={styles.svg} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input  className={styles.inputs} placeholder='Name' style={{display:'block',boxSizing:'border-box'}} type="text" name="title" id="title" title="Name" required/>
                    <input  className={styles.inputs} placeholder='Description' style={{display:'block',boxSizing:'border-box'}} type="text" name="description" id="description" title="Description" required/>
                    <span className={styles.check}><input  type="checkbox" name="airoadmap" id="airoadmap" checked={check} onChange={()=>setCheck(!check)}/>Generate AI Roadmap</span>
                    <textarea  className={styles.inputs} placeholder='Syllabus' style={{display:(check)?'block':'none',boxSizing:'border-box'}} name="syllabus" id="syllabus" title="Syllabus" required={check}/>
                    <button id='submitBtn' type='submit' style={{width:"fit-content",margin:'10px auto',backgroundColor:'var(--accentColor)',border:'none',color:"var(--primaryColor)",borderRadius:'5px'}}>Submit</button>
                    <CircularProgress id='circularProgress' style={{display:'none',margin:'30px auto'}} />
                </form>
            </div>


        </>
    )
}