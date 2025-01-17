import styles from './SelectStatus.module.css';

export default function SelectStatus({setStatus, module,difficulty,topic,status,index})
{
    const statusColor = {"not-started":'var(--red)','in-progress':'var(--yellow)','completed':'var(--green)'};

    function handleDrop(index)
    {
        let element = document.getElementById(`options${index}`);
        if(element.style.maxHeight == "0px")
        {
            element.style.setProperty("max-height","300px");
        }
        else
        {
            element.style.setProperty("max-height","0px");
        }
    }

    function handleChange(key,module,difficulty,topic,s)
    {
        document.getElementById(key).style.setProperty("max-height","0px");
        setStatus(module,difficulty,topic,s);
    }

    return(
        <>
            <div style={{position:'relative',zIndex:(1000-topic),width:'130px',height:'40px',display:'flex',alignItems:'start',justifyContent:'center'}}>
                <div style={{position:'absolute',width:'max-content',height:'fit-content',overflow:'hidden',borderRadius:'10px',backgroundColor:"var(--sidebarButtonBackground)"}}>

                    <p onClick={()=>handleDrop(index)} id={`status${index}`} className={styles.btn} style={{color:statusColor[status]}}>{status}</p>

                    <div id={`options${index}`} className={styles.options} style={{maxHeight:'0px'}}>
                        <p onClick={()=>handleChange(`options${index}`,module,difficulty,topic,"not-started")} style={{color:statusColor["not-started"],display:(status=="not-started")?"none":"block"}}>not-started</p>
                        <p onClick={()=>handleChange(`options${index}`,module,difficulty,topic,"in-progress")} style={{color:statusColor["in-progress"],display:(status=="in-progress")?"none":"block"}}>in-progress</p>
                        <p onClick={()=>handleChange(`options${index}`,module,difficulty,topic,"completed")} style={{color:statusColor["completed"],display:(status=="completed")?"none":"block"}}>completed</p>
                    </div>

                </div>
            </div>
            

        </>
    )
}   