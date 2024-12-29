import styles from './Roadmap.module.css';
import roadmap from './esd.json'
import arrow from '../../assets/dropdown.png';

export default function Roadmap()
{

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
    

    return(
        <>

            <div className={styles.container} style={{position:'relative'}}>

                <div className={styles.roadmap}>
                
                    {roadmap.map((item,key)=>
                    
                        <div key={key} className={styles.module}>


                            <div className={styles.header}>

                                <button className={styles.dropbtn} onClick={()=>handleDrop(key)}><img id={`arrow${key}`} style={{transform:'rotate(-90deg)',transition:'all 0.3s'}} src={arrow} alt="" /></button>
                                <p>{`Module - ${key+1}`}</p>
                                <span>{item.Module}</span>

                            </div>

                            <div id={`body${key}`} className={styles.body} style={{maxHeight:'0px'}}>


                                <div className={styles.hard}>

                                    <span>Hard</span>
                                    <div className={styles.topicDiv}>{(item.Topics.Hard.length>0)?item.Topics.Hard.map((topic,k)=><div className={styles.topic} key={k}>

                                        
                                        <p>{topic}</p>
                                        <hr />


                                    </div>):<p>No Hard Topics</p>}</div>
                                    

                                </div>

                                <div className={styles.medium}>

                                    <span>Medium</span>   
                                    <div className={styles.topicDiv}>{(item.Topics.Medium.length>0)?item.Topics.Medium.map((topic,k)=><div className={styles.topic} key={k}>

                                        
                                        <p>{topic}</p>
                                        <hr />


                                    </div>):<p>No Medium Topics</p>}</div>
                                    

                                </div>


                                <div className={styles.easy}>

                                    <span>Easy</span> 
                                    <div className={styles.topicDiv}>{(item.Topics.Easy.length>0)?item.Topics.Easy.map((topic,k)=><div className={styles.topic} key={k}>

                                           
                                        <p>{topic}</p>
                                        <hr />

                                    </div>):<p>No Easy Topics</p>}</div>
                                    

                                </div>

                            </div>


                        </div>
                    
                    )}
                    
                </div>

            </div>

        </>
    )
}