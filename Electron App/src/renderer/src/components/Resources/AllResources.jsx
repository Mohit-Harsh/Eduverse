import styles from './AllResources.module.css';
import Navbar from '../Navbar/Navbar';

export default function AllResources()
{
    function handleUpload()
    {
        
    }

    return(
        <>
            <div className={styles.container}>
                    
                <Navbar></Navbar>
    
                <div className={styles.resourceDiv}>
    
                    <div className={styles.header}>
    
                        <div>
                            <div className={styles.searchDiv}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                                </svg>
                                <input className={styles.searchInput} type="text" />
                            </div>
                            <button className={styles.btn}><svg style={{fill:"var(--svgFill)"}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M10.83 5a3.001 3.001 0 0 0-5.66 0H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17ZM4 11h9.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2Zm1.17 6H4a1 1 0 1 0 0 2h1.17a3.001 3.001 0 0 0 5.66 0H20a1 1 0 1 0 0-2h-9.17a3.001 3.001 0 0 0-5.66 0Z"/>
                                </svg><span>Filter</span>
                            </button>
                            <button className={styles.btn}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/>
                                </svg><span>Sort</span>
                            </button>
                        </div>
                        
                        <button className={styles.new} onClick={handleUpload}><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg><span>Upload</span>
                        </button>
    
                    </div>
    
                </div>
    
            </div>
        </>
    )
}