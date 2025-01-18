import styles from './ProjectRoadmap.module.css';
import { useLocation, useNavigate } from 'react-router';
import ProgressBar from '../ProgressBar/ProgressBar.jsx';
import ModuleForm from '../Forms/ModuleForm.jsx';
import { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import { Tooltip } from '@mui/material';
import { theme } from '../MuiTooltipTheme';
import {ThemeProvider} from '@mui/material';
import * as React from 'react';
import SelectStatus from '../Forms/SelectStatus.jsx';
import { Link } from 'react-router';
import NoFiles from '../Errors/NoFiles.jsx';
import { v1 } from 'uuid';

export default function ProjectRoadmap()
{
    const {state} = useLocation();

    const navigate = useNavigate();
    
    const [roadmap, setRoadmap] = useState(undefined);

    React.useEffect(()=>{
        
        async function getRoadmap()
        {
            console.log(state.dir);

            let res = await window.api.getRoadmap(state.dir);

            if(res.status == true)
            {
                setRoadmap(res.roadmap);
            }
            else
            {
                navigate("/error/Roadmap File Not Found");
            }
        }

        getRoadmap();

    },[])


    async function updateRoadmap()
    {
        let new_roadmap = [...roadmap];

        for(let j=0;j<new_roadmap.length;j++)
        {
            let c=0;
            let e = new_roadmap[j].Topics["Easy"].length;
            let m = new_roadmap[j].Topics["Medium"].length;
            let h = new_roadmap[j].Topics["Hard"].length;

            for(let i=0;i<e;i++)
            {
                if(new_roadmap[j].Topics["Easy"][i].status == "completed")
                {
                    c+=1;
                }
            }
            for(let i=0;i<m;i++)
            {
                if(new_roadmap[j].Topics["Medium"][i].status == "completed")
                {
                    c+=1;
                }
            }
            for(let i=0;i<h;i++)
            {
                if(new_roadmap[j].Topics["Hard"][i].status == "completed")
                {
                    c+=1;
                }
            }
            
            new_roadmap[j].Progress = Math.round((c/(e+m+h))*100);
        }

        const res = await window.api.saveRoadmap([new_roadmap,state.dir]);

        if(res == true)
        {
            setRoadmap(new_roadmap);
        }
    }
    

    function handleDrop(key)
    {
        let element = document.getElementById(`body${key}`);
        if(element.style.maxHeight == '0px')
        {
            element.style.setProperty('max-height','100vh');
            element.style.setProperty('overflow-y','scroll');
            document.getElementById(`arrow${key}`).style.setProperty('transform','rotate(90deg)');
        }
        else
        {
            element.style.setProperty('max-height','0px');
            element.style.setProperty('overflow-y','hidden');
            document.getElementById(`arrow${key}`).style.setProperty('transform','rotate(0deg)');
        }
    }

    function topicAdd(module,difficulty,dir)
    {
        let new_roadmap = [...roadmap]
        new_roadmap[module].Topics[difficulty].push({tid:v1(),title:"New Topic",status:"not-started"});
        const res = window.api.addTopic({new_roadmap,dir});
        if(res)
        setRoadmap(new_roadmap);
    }

    async function removeTopic(module,difficulty,topic,dir)
    {
        let new_roadmap = [...roadmap]
        const tid = new_roadmap[module].Topics[difficulty][topic].tid
        new_roadmap[module].Topics[difficulty] = new_roadmap[module].Topics[difficulty].slice(0,topic).concat(new_roadmap[module].Topics[difficulty].slice(topic+1));
        console.log(tid,new_roadmap);
        const res = await window.api.deleteTopic({new_roadmap,tid,dir});
        if(res)
        setRoadmap(new_roadmap);
    }

    function handleTopicChange(event,module,difficulty,topic)
    {
        let new_roadmap = [...roadmap];
        new_roadmap[module].Topics[difficulty][topic].title = event.target.value;
        setRoadmap(new_roadmap);
    }

    function setStatus(module,difficulty,topic,status)
    {
        let new_roadmap = [...roadmap];

        new_roadmap[module].Topics[difficulty][topic].status = status;

        setRoadmap(new_roadmap);

    }

    async function deleteModule(index,dir)
    {
        let new_roadmap = [...roadmap]
        new_roadmap = (new_roadmap.slice(0,index)).concat(new_roadmap.slice(index+1))
        const res = await window.api.deleteModule({roadmap,index,dir});
        if(res)
        setRoadmap(new_roadmap);
    }

    if(roadmap==undefined)
    {
        return(<>
            <div className={styles.container}>
                <Navbar></Navbar>
            </div>
        </>)
    }
    else
    return(
        <>
            <div className={styles.container}>

                <Navbar></Navbar>

                <ModuleForm roadmap={roadmap} setRoadmap={setRoadmap} dir={state.dir}></ModuleForm>

                <div className={styles.roadmap}>
                    
                    <div className={styles.title}>
                       <h3 title={state.course} >{state.course}</h3>
                       <div>
                            <ThemeProvider theme={theme}><Tooltip title='Refresh' placement='top' arrow><button className={styles.refreshbtn}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/></svg>
                            </button></Tooltip></ThemeProvider>
                            <ThemeProvider theme={theme}><Tooltip title='Save' placement='top' arrow><button onClick={updateRoadmap} className={styles.savebtn}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7V5h8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z" clipRule="evenodd"/></svg>
                            </button></Tooltip></ThemeProvider>
                            <button className={styles.newbtn} onClick={()=>{document.getElementById("moduleForm").style.setProperty("display","flex")}}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/></svg>New Module</button> 
                       </div>
                       
                    </div>

                    <hr style={{width:'100%',margin:'0px'}}/>

                
                    {(roadmap.length > 0) ? roadmap.map((item,key)=>
                    
                        <div key={key} className={styles.module}>


                            <div className={styles.header}>

                                <div className={styles.header_col1}>
                                    <div style={{display:'flex',gap:'10px',alignItems:'center',justifyContent:'start'}}>
                                        <button className={styles.dropbtn} onClick={()=>handleDrop(key)}><svg style={{transform:'rotate(0deg)'}} id={`arrow${key}`} className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m9 5 7 7-7 7"/></svg></button>
                                        <p style={{textWrap:'nowrap'}}>{`Module - ${key+1}`}</p>
                                    </div>
                                    <input onClick={(event)=>{event.target.focus()}} className={styles.header_span} defaultValue={item.Module}/>
                                </div>
                                
                                <div className={styles.moduleControl}>
                                    <div className={styles.progress} style={{display:'flex',alignItems:'center',justifyContent:'end',gap:'20px'}}>
                                        <span>{item.Progress}%</span><ProgressBar progress={item.Progress} /><span>{(item.Progress==100)?"completed":((item.Progress==0)?"not-started":"in-progress")}</span>
                                    </div>
                                    <ThemeProvider theme={theme}><Tooltip title='Resources' placement='top' arrow><Link style={{display:'flex',textAlign:'center'}} to={`/resources/${item.Module}`} state={{roadmap:item,dir:state.dir,id:item.mid}}><svg className={styles.resource} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm3 2h2.01v2.01h-2V8h2v2.01h-2V12h2v2.01h-2V16h2v2.01h-2v2H12V18h2v-1.99h-2V14h2v-1.99h-2V10h2V8.01h-2V6h2V4Z" clipRule="evenodd"/></svg>
                                    </Link></Tooltip></ThemeProvider>
                                    <ThemeProvider theme={theme}><Tooltip title='Delete' placement='top' arrow><button onClick={()=>deleteModule(key,state.dir)}><svg  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/></svg>
                                    </button></Tooltip></ThemeProvider>
                                </div>

                            </div>

                            <div id={`body${key}`} className={styles.body} style={{maxHeight:'0px'}}>

                                <div className={styles.easy}>

                                    <span>Easy</span>
                                    <div className={styles.topicDiv}>{(item.Topics.Easy.length>0)?item.Topics.Easy.map((topic,k)=><div className={styles.topic} key={k}>

                                        <hr style={{display:(k==0)?'none':'block'}}/>

                                        <div>
                                            <ThemeProvider theme={theme}><Tooltip title={topic.title} placement='top-start'><input onChange={(event)=>handleTopicChange(event,key,"Easy",k)} id={`module${key+1}easy${k+1}`} defaultValue={topic.title}/></Tooltip></ThemeProvider>
                                            <div>
                                                <SelectStatus setStatus={setStatus} module={key} difficulty={"Easy"} topic={k} status={topic.status} index={`module${key}_easy_topic${k}`}/>
                                                <ThemeProvider theme={theme}><Tooltip title='Resources' placement='top' arrow><Link style={{display:'flex',textAlign:'center'}} to={`/resources/${topic.title}`} state={{roadmap:item,dir:state.dir,id:topic.tid}}><svg className={styles.resource} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm3 2h2.01v2.01h-2V8h2v2.01h-2V12h2v2.01h-2V16h2v2.01h-2v2H12V18h2v-1.99h-2V14h2v-1.99h-2V10h2V8.01h-2V6h2V4Z" clipRule="evenodd"/></svg>
                                                </Link></Tooltip></ThemeProvider>
                                                <button onClick={()=>removeTopic(key,"Easy",k,state.dir)}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg></button>
                                            </div>  
                                        </div>
                                        

                                        </div>):<p>No Easy Topics</p>}
                                        
                                    </div>
                                    
                                    <div className={styles.addTopic}>
                                        <button onClick={()=>topicAdd(key,"Easy",state.dir)} className={styles.addbtn}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="var(--primaryColor)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>Topic</button>
                                    </div>

                                </div>
                                

                                <div className={styles.medium}>

                                    <span>Medium</span>   
                                    <div className={styles.topicDiv}>{(item.Topics.Medium.length>0)?item.Topics.Medium.map((topic,k)=><div className={styles.topic} key={k}>

                                        <hr style={{display:(k==0)?'none':'block'}}/>
                                        <div>
                                            <ThemeProvider theme={theme}><Tooltip title={topic.title} placement='top-start'><input onChange={(event)=>handleTopicChange(event,key,"Medium",k)} id={`module${key+1}medium${k+1}`} defaultValue={topic.title}/></Tooltip></ThemeProvider>
                                            <div>
                                                <SelectStatus setStatus={setStatus} module={key} difficulty={"Medium"} topic={k} status={topic.status} index={`module${key}_medium_topic${k}`}/>
                                                <ThemeProvider theme={theme}><Tooltip title='Resources' placement='top' arrow><Link style={{display:'flex',textAlign:'center'}} to={`/resources/${topic.title}`} state={{roadmap:item,dir:state.dir,id:topic.tid}}><svg className={styles.resource} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm3 2h2.01v2.01h-2V8h2v2.01h-2V12h2v2.01h-2V16h2v2.01h-2v2H12V18h2v-1.99h-2V14h2v-1.99h-2V10h2V8.01h-2V6h2V4Z" clipRule="evenodd"/></svg>
                                                </Link></Tooltip></ThemeProvider>
                                                <button onClick={()=>removeTopic(key,"Medium",k)}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg></button>
                                            </div>  
                                        </div>


                                    </div>):<p>No Medium Topics</p>}</div>
                                    
                                    <div className={styles.addTopic}>
                                        <button onClick={()=>topicAdd(key,"Medium",state.dir)} className={styles.addbtn}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="var(--primaryColor)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>Topic</button>
                                    </div>

                                </div>


                                
                                
                                <div className={styles.hard}>

                                    <span>Hard</span>
                                    <div className={styles.topicDiv}>{(item.Topics.Hard.length>0)?item.Topics.Hard.map((topic,k)=><div className={styles.topic} key={k}>

                                        <hr style={{display:(k==0)?'none':'block'}}/>
                                        <div>
                                            <ThemeProvider theme={theme}><Tooltip title={topic.title} placement='top-start'><input onChange={(event)=>handleTopicChange(event,key,"Hard",k)} id={`module${key+1}hard${k+1}`} defaultValue={topic.title} /></Tooltip></ThemeProvider>
                                            <div>
                                                <SelectStatus setStatus={setStatus} module={key} difficulty={"Hard"} topic={k} status={topic.status} index={`module${key}_hard_topic${k}`}/>
                                                <ThemeProvider theme={theme}><Tooltip title='Resources' placement='top' arrow><Link style={{display:'flex',textAlign:'center'}} to={`/resources/${topic.title}`} state={{roadmap:item,dir:state.dir,id:topic.tid}}><svg className={styles.resource} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm3 2h2.01v2.01h-2V8h2v2.01h-2V12h2v2.01h-2V16h2v2.01h-2v2H12V18h2v-1.99h-2V14h2v-1.99h-2V10h2V8.01h-2V6h2V4Z" clipRule="evenodd"/></svg>
                                                </Link></Tooltip></ThemeProvider>
                                                <button onClick={()=>removeTopic(key,"Hard",k)}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg></button>
                                            </div>  
                                        </div>


                                    </div>):<p>No Hard Topics</p>}</div>
                                    
                                    <div className={styles.addTopic}>
                                        <button onClick={()=>topicAdd(key,"Hard",state.dir)} className={styles.addbtn}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="var(--primaryColor)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>Topic</button>
                                    </div>

                                </div>

                            </div>


                        </div>
                    
                    ):<NoFiles title={"No Existing Modules"} msg={"Click on New Module button to create a module."}/>}
                    
                </div>

            </div>

        </>
    )
}