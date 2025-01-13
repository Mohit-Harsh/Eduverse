import { useLocation, useParams } from "react-router"

export default function ErrorPage()
{

    const error = useParams();

    console.log(error);
    
    return(<>

        <div>
            <h3>{error.errorname}</h3>
        </div>

    </>)
    
}