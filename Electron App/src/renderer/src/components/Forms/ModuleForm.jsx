import { useContext } from 'react';
import styles from './ModuleForm.module.css';
import * as React from 'react';
import {v1} from 'uuid';

export default function ModuleForm({roadmap,setRoadmap,dir})
{

    function handleClick()
    {

        let inputs = document.getElementsByClassName('inputs')

        for(let i=0;i<inputs.length;i++)
        {
            inputs[i].value="";
        }

        let form = document.getElementById("moduleForm");
        form.style.setProperty("display","none");
    }

    function createModule()
    {
        let name = document.getElementById("new_module_name").value;
        let new_roadmap = [...roadmap,{mid:v1(),Module:name,Progress:0,Topics:{"Easy":[],"Medium":[],"Hard":[]}}];
        const res = window.api.createModule({new_roadmap,dir});
        if(res){
            handleClick();
            setRoadmap(new_roadmap);
        }
    }

    return(
        <>

            <div id='moduleForm' className={styles.container} style={{display:'none'}}>
                <div style={{display:'flex',alignItems:"center",justifyContent:'end',width:'100%'}}>
                    <button className={styles.close} onClick={handleClick}><svg className={styles.svg} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>
                <input className='inputs' placeholder='Name' style={{display:'block',boxSizing:'border-box'}} type="text" name="name" id="new_module_name" title="name"/>
                <button onClick={createModule} style={{width:"fit-content",margin:'10px auto',backgroundColor:'var(--accentColor)',border:'none',color:"var(--primaryColor)",borderRadius:'5px'}}>create</button>
            </div>


        </>
    )
}