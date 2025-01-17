import ProgressBar from "../ProgressBar/ProgressBar.jsx"
import { delay, motion } from "motion/react"
import styles from './SubjectProgress.module.css';
import * as React from 'react';

export default function SubjectProgress({index,subject,unit,progress})
{
    
        const variant = {
            hidden: {
                y: -10, //move out of the site
                opacity: 0,
            },
            visible: {
                y: 0, // bring it back to nrmal
                opacity: 1,
                transition:{
                    delay:0.1*index,
                    when:'beforeChildren'
                }
            },
        };

    let screen = window.screen.width;
    

    return(<>

        <motion.div className={styles.div} initial='hidden' animate='visible' variants={variant} style={{position:'relative',backgroundColor:'var(--secondaryColor)',display:'block',boxSizing:'border-box', borderRadius:'10px',margin:'20px 0'}}>

            <div style={{width:'100%',boxSizing:'border-box',display:'flex',justifyContent:'space-between',alignItems:'end'}}>
                <div>
                    <span className={styles.span} style={{margin:0,fontWeight:'700',color:'var(--black)'}}>UNIT {unit}</span>
                    <span className={styles.span} style={{margin:'0 0 0 5px',color:'grey'}}>{subject}</span>
                </div>
                <div>
                    <span className={styles.span} style={{color:'var(--black)'}}>{progress}%</span>
                </div>
            </div>

            <div style={{width:'100%',boxSizing:'border-box',display:'flex',justifyContent:'space-around',alignItems:'center',margin:0}}>
                <ProgressBar progress={progress}/>
            </div>

        </motion.div>

    </>)
}