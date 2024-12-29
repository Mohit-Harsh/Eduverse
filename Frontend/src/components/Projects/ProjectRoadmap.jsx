import styles from './ProjectRoadmap.module.css';
import roadmap from './esd.json'
import arrow from '../../assets/dropdown.png';
import tick from '../../assets/tick_white.png';
import cross from '../../assets/cross_white.png';
import { useLocation } from 'react-router';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function ProjectRoadmap()
{
    const {state} = useLocation();

    let editElement = "";

    function handleDrop(key)
    {
        let element = document.getElementById(`body${key}`);
        if(element.style.maxHeight == '0px')
        {
            element.style.setProperty('max-height','100vh');
            element.style.setProperty('overflow-y','scroll');
            document.getElementById(`arrow${key}`).style.setProperty('transform','rotate(0deg)');
        }
        else
        {
            element.style.setProperty('max-height','0px');
            element.style.setProperty('overflow-y','hidden');
            document.getElementById(`arrow${key}`).style.setProperty('transform','rotate(-90deg)');
        }
    }
    
    function showModal(key)
    {
        document.getElementById('modal').style.setProperty('display','flex');
        document.getElementById('modal').setAttribute('content',key);
    }

    function handleSubmit()
    {
        let key = document.getElementById('modal').getAttribute('content');

        console.log(document.getElementById(key));

        document.getElementById(key).innerText = document.getElementById('input').value;
        document.getElementById('input').value = '';
        document.getElementById('modal').style.setProperty('display','none');
    }

    function handleCancel()
    {
        document.getElementById('modal').style.setProperty('display','none');
    }

    return(
        <>
            <div className={styles.container} style={{position:'relative'}}>

                <div id='modal' className={styles.modal} content=''>

                    <div>
                        <input id='input' type="text" />
                        <div>
                            <button className={styles.submit} onClick={handleSubmit}><img src={tick} alt="" /></button>
                            <button className={styles.cancel} onClick={handleCancel}><img src={cross} alt="" /></button>
                        </div>
                    </div>
                    

                </div>

                <div className={styles.roadmap}>

                    <h3>{state.course}</h3>
                
                    {roadmap.map((item,key)=>
                    
                        <div key={key} className={styles.module}>


                            <div className={styles.header}>

                                <div className={styles.header_col1}>
                                    <div style={{display:'flex',gap:'10px',alignItems:'center',justifyContent:'start'}}>
                                        <button className={styles.dropbtn} onClick={()=>handleDrop(key)}><img id={`arrow${key}`} style={{transform:'rotate(-90deg)',transition:'all 0.3s'}} src={arrow} alt="" /></button>
                                        <p style={{textWrap:'nowrap'}}>{`Module - ${key+1}`}</p>
                                    </div>
                                    <span className={styles.header_span}>{item.Module}</span>
                                </div>
                                <div className={styles.progress} style={{display:'flex',alignItems:'center',justifyContent:'end',gap:'20px',width:'100%'}}>
                                    <ProgressBar progress={item.Progress} /><span>{item.Progress}%</span>
                                </div>
                                

                            </div>

                            <div id={`body${key}`} className={styles.body} style={{maxHeight:'0px'}}>

                                <div className={styles.easy}>

                                    <span>Easy</span> 
                                    <div className={styles.topicDiv}>{(item.Topics.Easy.length>0)?item.Topics.Easy.map((topic,k)=><div className={styles.topic} key={k}>

                                           
                                    <div><p id={`module${key+1}easy${k+1}`}>{topic}</p><button onClick={()=>showModal(`module${key+1}easy${k+1}`)}>edit</button></div>
                                        <hr />

                                    </div>):<p>No Easy Topics</p>}</div>
                                    

                                </div>
                                

                                <div className={styles.medium}>

                                    <span>Medium</span>   
                                    <div className={styles.topicDiv}>{(item.Topics.Medium.length>0)?item.Topics.Medium.map((topic,k)=><div className={styles.topic} key={k}>

                                        
                                        <div><p id={`module${key+1}med${k+1}`}>{topic}</p><button onClick={()=>showModal(`module${key+1}med${k+1}`)}>edit</button></div>
                                        <hr />


                                    </div>):<p>No Medium Topics</p>}</div>
                                    

                                </div>


                                
                                
                                <div className={styles.hard}>

                                    <span>Hard</span>
                                    <div className={styles.topicDiv}>{(item.Topics.Hard.length>0)?item.Topics.Hard.map((topic,k)=><div className={styles.topic} key={k}>

                                        
                                    <div><p id={`module${key+1}hard${k+1}`}>{topic}</p><button onClick={()=>showModal(`module${key+1}hard${k+1}`)}>edit</button></div>
                                        <hr />


                                    </div>):<p>No Hard Topics</p>}</div>
                                    

                                </div>

                            </div>


                        </div>
                    
                    )}
                    
                </div>

            </div>

        </>
    )
}