import styles from './Sidebar.module.css';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { NavLink } from 'react-router';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import folderIcon from '../../assets/folder.svg';


export default function Sidebar()
{
    return(
        <>
            <div className={styles.container}>

                <div>

                    <h3 className={styles.logo}>EduVerse</h3>

                    <div className={styles.body}>

                        <NavLink className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} to={'/course'}><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path strokeWidth='0' fillRule="evenodd" d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z" clipRule="evenodd"/></svg><span>Projects</span></NavLink>
                        <NavLink to={'/explore'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon}  aria-hidden="true" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
                        <path strokeWidth='0' fillRule="evenodd" d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z" clipRule="evenodd"/>
                        </svg><span>Explore</span></NavLink>
                        <NavLink to={'/resources'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" fill='none'/>
                        </svg><span>Resources</span></NavLink>
                        <NavLink to={'/requests'} className={({ isActive }) => isActive ? styles.activeLink : styles.inactiveLink} ><svg className={styles.icon} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path strokeWidth={0} fillRule="evenodd" d="M3 6a3 3 0 1 1 4 2.83v6.34a3.001 3.001 0 1 1-2 0V8.83A3.001 3.001 0 0 1 3 6Zm11.207-2.707a1 1 0 0 1 0 1.414L13.914 5H15a4 4 0 0 1 4 4v6.17a3.001 3.001 0 1 1-2 0V9a2 2 0 0 0-2-2h-1.086l.293.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Z" clipRule="evenodd"/>
                        </svg><span>Requests</span></NavLink>

                    </div>

                </div>

                <div className={styles.footer}>

                    <button className={styles.logout}><LogoutRoundedIcon /> <span>Sign Out</span></button>

                </div>
            </div>
        </>
    )
}