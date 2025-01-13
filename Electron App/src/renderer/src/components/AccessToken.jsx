import { useLocation, useParams } from "react-router"

export default function AccessToken({setCredentials})
{
    const params = useLocation();

    setCredentials(params.hash.substring(1));

    return(<>
    </>)
}