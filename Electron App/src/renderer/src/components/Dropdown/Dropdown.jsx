import * as React from 'react';
import styles from './Dropdown.module.css';
import { useState,useEffect } from 'react';

export default function Dropdown({val,setVal,labelId,id,title,data}) {

 function handlechange()
 {
    setVal(document.getElementById(id).value);
 }

  return (
    <>
    <div style={{position:'relative',margin:0,padding:0,width:'fit-content',height:'fit-content'}}>
      <select className={styles.dropdown} id={id} onChange={handlechange}>
        {data.map((item,key)=><option key={key} value={item}>{item}</option>)}
      </select>
    </div>
    </>
  );
}
