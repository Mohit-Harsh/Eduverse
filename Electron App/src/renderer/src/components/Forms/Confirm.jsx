
export default function Confirm({title,msg,handleConfirm,handleCancel})
{5
    return(<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'fit-content',height:'fit-content',
    boxShadow:'0px 0px 8px 4px var(--shadowColor)', backgroundColor:'var(--formBackground)', borderRadius:'5px',border:"1px solid var(--formBorder)"}}>

        <h3 style={{display:'flex',width:'fit-content',margin:'0px auto',fontSize:'18px',fontWeight:'700',color:'var(--text)'}}>{title}</h3>
        <p style={{display:'flex',width:'fit-content',margin:'0px auto',fontSize:'14px',fontWeight:'400',color:'var(--sidebarButtonBackground)'}}>{msg}</p>
        <div>
            <button onClick={handleCancel} style={{width:'fit-content',padding:'10px 20px', boxSizing:'border-box',
            color:'var(--text)',backgroundColor:'var(--secondaryColor)', border:'none', borderRadius:'10px'}}>No</button>
            <button onClick={handleConfirm} style={{width:'fit-content',padding:'10px 20px', boxSizing:'border-box',
            color:'var(--text)',backgroundColor:'var(--secondaryColor)', border:'none', borderRadius:'10px'}}>Yes</button>
        </div>

    </div>)
}