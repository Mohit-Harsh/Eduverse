import Switch from '@mui/material/Switch';
import * as React from 'react';
import logo from '../../assets/logo.png';
import logo_dark from '../../assets/logo_dark.png';
import { useNavigate } from 'react-router';



export default function Navbar({pageName})
{
    const navigate = useNavigate();

    return(<>

        <div style={{zIndex:2,backgroundColor:'var(--primaryColor)',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'30px',margin:'0px',borderBottom:'1px solid var(--border)'}}>

            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'20px'}}>
                <button onClick={()=>navigate(-1)} style={{display:'flex',fontWeight:'bold',gap:'5px',alignItems:'center',justifyContent:'center',backgroundColor:"var(--accentColor)",color:'var(--primaryColor)',border:'none',borderRadius:'5px',padding:'5px 10px',cursor:"pointer"}}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="none" viewBox="0 0 24 24">
                    <path stroke="var(--primaryColor)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/></svg>
                    Back
                </button>
                <h3 style={{color:'var(--text)',fontSize:'18px',fontWeight:'600'}}>{(pageName!=undefined)?pageName:"Home"}</h3>
            </div>

        </div>

    </>)
}