import * as React from "react"
import Navbar from "../Navbar/Navbar"
import styles from './ResourcePage.module.css';
import { useLocation, useParams } from "react-router";
import { useState } from "react";
import ResourceUpload from "../Forms/ResourceUpload";
import NoFiles from "../Errors/NoFiles";
import FileIcon from "./FileIcon";
import formatFileSize from "../formatFileSize";
import { ThemeProvider } from "@mui/material";
import { theme } from "../MuiTooltipTheme";
import {Tooltip} from "@mui/material";
import { Link } from "react-router";
import { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function ResourcePage()
{
    const {state} = useLocation();

    const params = useParams();

    const [resources,setResources] = useState(undefined);

    const [searchResults,setSearchResults] = useState(undefined);

    useEffect(()=>{
        setSearchResults((resources!=undefined)?resources:undefined);
    },[resources]);

    useEffect(()=>{

        async function getResources()
        {
            const data = await window.api.getResources({dir:state.dir,id:state.id});
            setResources(data);
        }

        getResources();

    },[]);


    function showUploadForm()
    {
        document.getElementById('upload_form').style.setProperty("display","flex");
    }

    async function handleDelete(file)
    {
        console.log(file);
        const res = await window.api.deleteResource(file);
        if(res)
        {
            let new_resources = [...resources].filter(item=>item!=file);
            setResources(new_resources);
        }
    }
    
    function handleSearch(event)
    {
        let new_resources = [...resources].filter(item=>item.name.includes(event.target.value));
        setSearchResults(new_resources);
    }

    async function handleDriveUpload(item) {
        const res = await window.api.uploadDriveFile(item);
    }

    if(resources == undefined || searchResults == undefined)
    {
        return(<CircularProgress style={{color:"var(--accentColor)"}} />)
    }
    else
    return(<>
        
        <div className={styles.container}>
        
            <Navbar></Navbar>

            <ResourceUpload dir={state.dir} id={state.id} resources={resources} setResources={setResources}/>

            <div className={styles.resourceDiv}>

                <h3 className={styles.title}>{params.coursename}</h3> 
                
                <div className={styles.tools}>
                    <Link style={{textDecoration:'none'}} to={`/resources/airecommendation/${params.coursename}`}>
                        <div className={styles.toolsDiv}>
                            <h3 className={styles.recomBtn} >AI Recommendations</h3>
                            <p>Discover personalized AI-powered study material recommendations! Get curated guides, tutorials, courses, and more to boost your learning and achieve your goals efficiently.</p>
                        </div>
                    </Link>
                </div>
                

                <div className={styles.header}>

                    <div>
                        <div className={styles.searchDiv}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                            </svg>
                            <input className={styles.searchInput} type="text" onChange={handleSearch}/>
                        </div>
                        <button className={styles.btn}><svg style={{fill:"var(--svgFill)"}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"/>
                            </svg><span>Filter</span>
                        </button>
                        <button className={styles.btn}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/>
                            </svg><span>Sort</span>
                        </button>
                    </div>
                    
                    <button className={styles.new} onClick={showUploadForm}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2M12 4v12m0-12 4 4m-4-4L8 8"/></svg>
                        <span>Upload</span>
                    </button>

                    

                </div>
                
                

                {searchResults.length>0?<div><div className={styles.tableHeader}>
                    <p>Name</p>
                    <p>Type</p>
                    <p>Size</p>
                    <p>Last Modified</p>
                </div>
                <div>
                        
                    {searchResults.map((item,key)=><div key={key} className={styles.tableRow}>

                        <p className={styles.name} onClick={()=>{window.api.openFile(item.path)}}><FileIcon type={item.type}/>{item.name}</p>
                        <p>{item.type}</p>
                        <p>{formatFileSize(item.size)}</p>
                        <div className={styles.tableRow_div}>
                            <span>{(new Date(item.date)).toLocaleDateString('en-GB')}</span>
                            <div>
                                <svg className={styles.drive} onClick={()=>handleDriveUpload(item)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M17.5 3a3.5 3.5 0 0 0-3.456 4.06L8.143 9.704a3.5 3.5 0 1 0-.01 4.6l5.91 2.65a3.5 3.5 0 1 0 .863-1.805l-5.94-2.662a3.53 3.53 0 0 0 .002-.961l5.948-2.667A3.5 3.5 0 1 0 17.5 3Z"/>
                                </svg> 
                                <svg onClick={()=>handleDelete(item)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                    </div>)}

                </div></div>:<NoFiles title={"No Existing Resources"} msg={"Click on Upload button to upload a resource."}/>}
                
            </div>

        </div>

    </>)
}