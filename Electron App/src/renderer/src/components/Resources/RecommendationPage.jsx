import { useState } from "react";
import { useEffect } from "react";
import styles from './RecommendationPage.module.css';
import { useParams } from "react-router";
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "../Navbar/Navbar";

export default function RecommendationPage()
{
    const [recom,setRecom] = useState(undefined);

    const params = useParams();

    useEffect(()=>{

        async function getRecommendations()
        {
            const response = await window.api.resourceRecommendations(params.topic);
            console.log(response);
            setRecom(response);
        }
        getRecommendations();
    },[])

    if(recom == undefined)
    {
        return(<CircularProgress/>)
    }
    else
    return(<>

        <div className={styles.container}>

            <Navbar pageName={"AI Recommendations"}></Navbar>

            {recom.map((item,key)=><div key={key} className={styles.recomDiv}>

                <h3>{item['query']}</h3>

                <div>
                    {item['data'].map((data,k)=><div key={k} className={styles.recomList}>

                        <p className={styles.recomWebsite}>{data['website']}</p>
                        <h3 onClick={()=>window.api.openLink(data['link'])} className={styles.recomTitle}>{data['title']}</h3>
                        <p className={styles.recomDes}>{data['description']}</p>

                    </div>)}
                </div>

            </div>)}
        
        </div>

    </>)
}