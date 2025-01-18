import { useLocation } from 'react-router';
import styles from './ResourceUpload.module.css';
import { useState } from 'react';
import DropFileInput from './DropFileInput';

export default function ResourceUpload({dir,id,resources,setResources})
{

    const [mode,setMode] = useState(0);

    const [file,setFile] = useState(undefined);

    async function handleSubmit(event)
    {
        event.preventDefault();

        if(mode)
        {
            const req = {data:{
                    "name":document.getElementById("resource_title").value,
                    "date":file.lastModifiedDate.toLocaleDateString('en-GB'),
                    "type":file.type,
                    "size":file.size,
                    "location":file.path},
                id:id,
                dir:dir
            }

            const res = await window.api.uploadFile(req);

            if(res.status)
            {
                setResources(res.data);
                handleClose();
            }
        }
        else
        {
            const req = {data:{
                "title":document.getElementById("resource_title").value,
                "date":(new Date()).toLocaleDateString("en-GB"),
                "type":"link",
                "link":document.getElementById("resource_link").value},
                id:id,
                dir:dir
            }

            const res = await window.api.uploadFile(req);

            if(res.status)
            {
                setResources(res.data);
                handleClose();
            }
        }
        
    }

    function handleClose()
    {
        document.getElementById("upload_form").style.setProperty("display","none");
    }


    return(
        
        <div id='upload_form' className={styles.container} style={{position:'absolute',zIndex:3,margin:'auto'}}>

            <button className={styles.close} onClick={handleClose}><svg className={styles.svg} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clipRule="evenodd"/>
                </svg>
            </button>
            
            <h3>Resource Upload</h3>

            <div className={styles.mode}>

                <button onClick={()=>setMode(0)} className={mode==0?styles.btnActive:styles.btnInactive}>LINK</button>
                <button onClick={()=>setMode(1)} className={mode==1?styles.btnActive:styles.btnInactive}>FILE</button>

            </div>

            {mode==1?<form onSubmit={handleSubmit}>
                <input id='resource_title' style={{display:'block',backgroundColor:'transparent',border:'1px solid var(--formBorder)',borderRadius:'5px',
                color:'var(--text)',padding:'10px 20px'}} type="text" name="title" placeholder="Name" required/>
                <DropFileInput file={file} setFile={setFile} />
                <button type="submit" style={{backgroundColor:'var(--accentColor)',color:'var(--primaryColor)',border:'none',padding:'10px 20px',
                fontSize:'14px',fontWeight:'600',borderRadius:'5px',cursor:"pointer",width:'fit-content',marginTop:'30px'}}>Submit</button>
            </form>:<form onSubmit={handleSubmit}>
                <input id='resource_title' style={{display:'block',backgroundColor:'transparent',border:'1px solid var(--formBorder)',borderRadius:'5px',
                color:'var(--text)',padding:'10px 20px'}} type="text" name="title" placeholder="Name" required/>
                <input id='resource_link' style={{display:'block',backgroundColor:'transparent',border:'1px solid var(--formBorder)',borderRadius:'5px',
                color:'var(--text)',padding:'10px 20px'}} type="text" name="link" placeholder="Link" required/>
                <button type="submit" style={{backgroundColor:'var(--accentColor)',color:'var(--primaryColor)',border:'none',padding:'10px 20px',
                fontSize:'14px',fontWeight:'600',borderRadius:'5px',cursor:"pointer",width:'fit-content',marginTop:'30px'}}>Submit</button>
            </form>}

        </div>
    )
}