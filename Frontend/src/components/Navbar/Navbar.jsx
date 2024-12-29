export default function Navbar()
{
    return(<>

        <div style={{position:'sticky',top:'0',zIndex:2,backgroundColor:'var(--primaryColor)',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0px 20px',margin:'0px',borderBottom:'1px solid lightgrey'}}>

            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'20px'}}>
                <h3>Hello!</h3>
                <p>Lorem Epsom</p>
            </div>
            

            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>
                <button>btn</button>
                <button>btn</button>  
            </div>
            


        </div>

    </>)
}