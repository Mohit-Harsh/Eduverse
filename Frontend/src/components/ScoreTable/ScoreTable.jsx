import { useState } from "react"
import styles from './ScoreTable.module.css';
import icon from '../../assets/dropdown.png';

export default function ScoreTable()
{
    const [show,setShow] = useState(false);

    let screen = window.screen.width;

    const data = [{sem:1,credits:10,backlogs:0,sgpa:9.4,result:[{subject:'Physics',credits:3,points:9},{subject:'Maths',credits:4,points:9},{subject:'Chemistry',credits:3,points:8}]},
    {sem:2,credits:10,backlogs:0,sgpa:8.8,result:[{subject:'EC',credits:3,points:9},{subject:'APC',credits:4,points:8},{subject:'DSD',credits:3,points:9}]},
    {sem:3,credits:10,backlogs:0,sgpa:8.8,result:[{subject:'EC',credits:3,points:9},{subject:'APC',credits:4,points:8},{subject:'DSD',credits:3,points:9}]},
    {sem:4,credits:10,backlogs:0,sgpa:8.8,result:[{subject:'EC',credits:3,points:9},{subject:'APC',credits:4,points:8},{subject:'DSD',credits:3,points:9}]},
    {sem:5,credits:10,backlogs:0,sgpa:8.8,result:[{subject:'EC',credits:3,points:9},{subject:'APC',credits:4,points:8},{subject:'DSD',credits:3,points:9}]},
    {sem:6,credits:10,backlogs:0,sgpa:8.8,result:[{subject:'EC',credits:3,points:9},{subject:'APC',credits:4,points:8},{subject:'DSD',credits:3,points:9}]}]

    function handleClick(sem)
    {
        let element = document.getElementById(sem)
        let height = element.style.maxHeight;

        if(height == '0px' || height == null || height == ' ')
        {
            element.style.setProperty('max-height','300px');
            document.getElementById(`btn${sem}`).style.setProperty('transform','rotate(0deg)');
        }
        else
        {
            element.style.setProperty('max-height','0px');
            document.getElementById(`btn${sem}`).style.setProperty('transform','rotate(-90deg)');
        }
    }

    return(<>

        <div style={{position:'relative',width:'100%',height:'100%',padding:'20px',boxSizing:'border-box',overflow:'hidden'}}>

            <div className={styles.title} style={{display:'grid',gridTemplateColumns:'3fr 1fr 1fr 1fr'}}>

                <span>Semester</span>
                <span style={{textAlign:'center'}}>Credits</span>
                <span style={{textAlign:'center'}}>Backlogs</span>
                <span style={{textAlign:'center'}}>Sgpa</span>

            </div>

            <hr />

            <div style={{overflowY:'scroll',height:'70%'}}>

                {data.map((item,key)=>

                    <div  key={`div_row_${key}`} style={{margin:0,padding:0}}>

                        <div className={styles.data} style={{display:'grid',gridTemplateColumns:'3fr 1fr 1fr 1fr'}}>

                            <span className={styles.btnspan}><button  className={styles.dropbtn} onClick={()=>{handleClick(item.sem)}}><img id={`btn${item.sem}`} src={icon} className={styles.arrow}/></button>SEM {item.sem}</span>
                            <span style={{textAlign:'center'}}>{item.credits}</span>
                            <span style={{textAlign:'center'}}>{item.backlogs}</span>
                            <span style={{textAlign:'center'}}>{item.sgpa}</span>

                        </div>

                        <div className={styles.subjectScores} id={item.sem} style={{maxHeight:'0px'}}>

                            <hr />

                            <div className={styles.title} style={{display:'grid',marginBottom:'5px',gridTemplateColumns:'3fr 1fr 1fr',width:'100%'}}>

                                <span>Subject</span>
                                <span style={{textAlign:'center'}}>Credits</span>
                                <span style={{textAlign:'center'}}>Points</span>

                            </div>

                            {item.result.map((res,k)=> 
                                <div className={styles.data} key={`div2_div${k}`} style={{display:'grid',gridTemplateColumns:'3fr 1fr 1fr'}}>

                                    <span>{res.subject}</span>
                                    <span style={{textAlign:'center'}}>{res.credits}</span>
                                    <span style={{textAlign:'center'}}>{res.points}</span>

                                </div>)}

                        </div>

                        <hr/>

                    </div>

                    )}

            </div> 


        </div>

    </>)
}