import styles from './Sidebar.module.css';
import { NavLink } from 'react-router';
import * as React from 'react';
import logo from '../../assets/logo.png';
import logo_dark from '../../assets/logo_dark.png';
import { Switch } from '@mui/material';


export default function Sidebar()
{

    function handleChange()
    {
        let theme = document.documentElement.getAttribute("theme-mode");
        if(theme == "light")
        {
            document.documentElement.setAttribute("theme-mode",'dark');
            document.getElementById("brandLogo").setAttribute("src",logo_dark);
        }
        else
        {
            document.documentElement.setAttribute("theme-mode",'light');
            document.getElementById("brandLogo").setAttribute("src",logo);
        }
    }

    return(
        <>
            <div className={styles.container}>

                <div>

                    <img id='brandLogo' className={styles.logo} src={(document.documentElement.getAttribute("theme-mode") == "dark")?logo_dark:logo} alt=''/>

                    <p className={styles.menuSection}>MAIN MENU</p>

                    <div className={styles.body}>

                        <NavLink className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} to={'/course'}><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/></svg>
                        <span>Projects</span></NavLink>
                        <NavLink to={'/explore'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>
                        <span>Explore</span></NavLink>
                        <NavLink to={'/resources'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/></svg>
                        <span>Resources</span></NavLink>
                        <NavLink to={'/requests'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V9a3 3 0 0 0-3-3h-3m1.5-2-2 2 2 2"/></svg>
                        <span>Requests</span></NavLink>

                    </div>

                    <p className={styles.menuSection}>ACCOUNT</p>

                    <div className={styles.body}>

                        <NavLink className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} to={'/switch'}><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/></svg>
                        <span>Switch</span></NavLink>
                        <NavLink to={'/logout'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                        <span>Settings</span></NavLink>

                    </div>

                    <p className={styles.menuSection}>SUPPORT</p>

                    <div className={styles.body}>

                        <NavLink className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} to={'/help'}><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"/></svg>
                        <span>Help</span></NavLink>
                        <NavLink to={'/about'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>
                        <span>About us</span></NavLink>

                    </div>

                </div>

                <div className={styles.footer}>
                    <div>
                        <button style={{backgroundColor:'transparent',border:'none',color:'var(--primaryColor)',textAlign:'center'}}><svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="var(--svgFill)" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd"/></svg>
                        </button>
                        <span>Lorem Epsom</span>
                    </div>
                    <Switch onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }}/>              
                </div>
            </div>
        </>
    )
}