import { useEffect } from "react";
import creds from '../../../../credentials.json';

export default function LoginPage({clientId,setCredentials})
{
    const client = google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      ux_mode: 'popup',
      callback: (response) => {console.log(response);setCredentials(response)},
    });

    return(<>
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <button onClick={()=>client.requestCode()}>Google OAuth 2.0</button>
    </div>
    </>)
}