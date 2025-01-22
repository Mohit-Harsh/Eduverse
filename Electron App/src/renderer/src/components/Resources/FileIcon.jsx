import styles from './FileIcon.module.css';
import pdf_icon from '../../assets/pdf_icon.png';
import docx_icon from '../../assets/docx_icon.png';
import pptx_icon from '../../assets/pptx_icon.png';
import file_icon from '../../assets/file_icon.png';
import link_icon from '../../assets/link_icon.png';

export default function FileIcon({type})
{
    if(type.split("/")[0] == '.png' || type == ".jpg" || type == ".jpeg")
        return(<svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
            <path fill="#90CAF9" d="M40 45L8 45 8 3 30 3 40 13z"></path><path fill="#E1F5FE" d="M38.5 14L29 14 29 4.5z"></path><path fill="#1565C0" d="M21 23L14 33 28 33z"></path><path fill="#1976D2" d="M28 26.4L23 33 33 33zM31.5 23A1.5 1.5 0 1 0 31.5 26 1.5 1.5 0 1 0 31.5 23z"></path>
        </svg>
        );
    else if(type == '.pdf')
        return(<img src={pdf_icon} alt='' className={styles.icon}/>);
    else if(type == '.pptx')
        return(<img src={pptx_icon} alt='' className={styles.icon}/>);
    else if(type == '.docx' || type == '.doc')
        return(<img src={docx_icon} alt="" className={styles.icon}/>);
    else if(type == '.url')
        return(<img className={styles.icon} src={link_icon} alt="" />);
    else
    return(<img className={styles.icon} src={file_icon} alt="" />);
}