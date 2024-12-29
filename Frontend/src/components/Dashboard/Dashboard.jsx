import styles from './Dashboard.module.css';
import Sidebar from '../Sidebar/Sidebar';
import attendance from '../../assets/attendance.png';
import courses from '../../assets/courses.png';
import cgpa from '../../assets/cgpa.png';
import credits from '../../assets/credits.png';
import { useEffect, useState } from 'react';
import PieChart from '../SubjectProgress/PieChart';
import Chart from 'chart.js/auto';
import Dropdown from '../Dropdown/Dropdown';
import SubjectProgress from '../SubjectProgress/SubjectProgress';
import ScoreTable from '../ScoreTable/ScoreTable';
import { motion } from 'motion/react';


export default function Dashboard()
{
    let screen = window.screen.width;

    const [graphDim,setGraphDim] = useState([0,0]);

    const incomplete = [{subject:'VLSI',unit:'II',progress:60},{subject:'ESD',unit:'III',progress:40},{subject:'IPR',unit:'II',progress:60},{subject:'WSN',unit:'II',progress:50},{subject:'DDTV',unit:'III',progress:70}]
    const complete = [{subject:'VLSI',unit:'I'},{subject:'ESD',unit:'II'},{subject:'ESD',unit:'I'},{subject:'IPR',unit:'I'},{subject:'WSN',unit:'I'},{subject:'DDTV',unit:'I'},{subject:'DDTV',unit:'II'}]

    const pst = [20,15,14,16,18];
    const abs = [0,5,6,4,2];
    const xLabels = [
    'VLSI',
    'ESD',
    'IPR',
    'DDTV',
    'WSN'
    ];

    const data = {
        labels: ['VLSI','ESD','IPR','WSN','DDTV'],
        datasets: [{
          label: 'Present',
          data: [20,16,14,15,18],
          backgroundColor: [
            '#85CED7'
          ],
          borderColor: [
            '#85CED7'
          ],
          borderWidth: 1
        },{
            label: 'Absent',
            data: [0,4,6,5,2],
            backgroundColor: [
              '#5A75E6'
            ],
            borderColor: [
              '#5A75E6'
            ],
            borderWidth: 1
          }]
      };

      const boxVariant = {
        hidden: {//move out of the site
        },
        visible: {
            transition: {
                delay: 0.5,
                when: "beforeChildren", //use this instead of delay
                staggerChildren: 0.2, //apply stagger on the parent tag
            },
        },
    };

      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','All']
      const [val, setVal] = useState('All');

      useEffect(()=>{
        new Chart(
            document.getElementById('bargraph'),
            {
              type: 'bar',
              data: data
            }
          );
      },[])


    return(
        <>
            <div className={styles.container}>
            
                <div className={styles.header}>

                    <h3>Dashboard</h3>
                    <div>
                        <span>Lorem Ipsum</span>
                        <button>L</button>
                    </div>

                </div>
                
                <div className={styles.dashboard}>


                    <div className={styles.row1}>

                        <div>

                            <div>
                                <p>Credits</p>
                                <h4>25/25</h4>
                            </div>
                            <div className={styles.icondiv}>
                                <img src={credits} alt="" />
                            </div>

                        </div>

                        <div>
                            <div>
                                <p>Attendance</p>
                                <h4>78%</h4>
                            </div>
                            <div className={styles.icondiv}>
                                <img src={attendance} alt="" />
                            </div>
                        </div>

                        <div>
                            <div>
                                <p>Courses Completed</p>
                                <h4>25/42</h4>
                            </div>
                            <div className={styles.icondiv}>
                                <img src={courses} alt="" />
                            </div>
                        </div>

                        <div>
                            <div>
                                <p>CGPA</p>
                                <h4>8.5/10</h4>
                            </div>
                            <div className={styles.icondiv}>
                                <img src={cgpa} alt="" />
                            </div>
                        </div>

                    </div>

                    <div className={styles.row2}>

                        <div className={styles.row2_col1} style={{boxSizing:'border-box'}}>

                            <div style={{display:'flex',justifyContent:'space-between',height:'50px',alignItems:'center',padding:'0'}}>
                                <p style={{margin:'0',fontSize:'16px',fontWeight:'500'}}>Attendance</p>
                                
                                <Dropdown val={val} setVal={setVal} labelId={'attendanceLabel'} id={'attendance'} title={'Month'} data={months}/>
                                
                            </div>
                            
                            <div className={styles.attendanceDiv}>
                                <canvas id='bargraph'></canvas>   
                            </div>  
                                    
                            
                        </div>

                        <motion.div className={styles.row2_col2}>

                            <div>
                                <p style={{margin:'0',fontSize:'16px',fontWeight:'500'}}>Course Progression</p>
                                <div style={{overflowY:'scroll',margin:'10px 0',padding:'0 20px 0 0',height:'80%',boxSizing:'border-box'}}>
                                    <p style={{color:'gray',fontWeight:400,margin:'0'}}>In Progress</p>
                                    {incomplete.map((item,key)=><SubjectProgress index={key} key={key} subject={item.subject} unit={item.unit} progress={item.progress} />)}
                                    <p style={{color:'gray',fontWeight:400,margin:'0'}}>Completed</p>
                                    {complete.map((item,key)=><SubjectProgress index={key} key={key} subject={item.subject} unit={item.unit} progress={100} />)}
                                </div>
                            </div>

                            <div style={{padding:'10px 20px',boxSizing:'border-box',display:'flex',flexDirection:'column',rowGap:'10px'}}>
                                <p style={{margin:'0',fontSize:'16px',fontWeight:'500'}}>Course Completion</p>
                                <PieChart chartId={'course_progress'} title={'Course Progress'} labels={['ESD','VLSI','WSN','IPR','DDTV']} values={[30,50,60,40,70]}/>
                            </div>                                
                            
                        </motion.div>

                    </div>

                    <div className={styles.row3}>

                        <div className={styles.row3_col1} style={{overflow:'hidden'}}>
                            <ScoreTable></ScoreTable>
                        </div>

                        <div className={styles.row3_col2}>

                        </div>

                    </div>

                </div>

            </div>

            
        </>
    )
}