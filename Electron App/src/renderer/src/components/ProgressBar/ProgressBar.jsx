import { keyframes } from '@emotion/react';
import styles from './ProgressBar.module.css';
import * as React from 'react';

import { motion } from "motion/react"

export default function ProgressBar({progress})
{

    return(
    <>

        <motion.div style={{position:'relative',height:'5px',width:'100%',backgroundColor:'#85CED7',borderRadius:'10px'}}>

            <motion.div initial={{width:0}} whileInView={{width:`${progress}%`}} viewport={{once:true}} transition={{type:'tween',ease:'easeOut',duration:0.5,delay:0.2}} className={styles.progressThumb} style={{position:'absolute',left:0,height:'100%',width:`${progress}%`,backgroundColor:'#5A75E6',borderRadius:'10px'}}>

            </motion.div> 

        </motion.div>

    </>)
}