import { useEffect, useState } from 'react';
import Button from "@/components/shared/button";
import ErrorMsg from "@/components/shared/messageError";
import T from "@/components/shared/translate";
import { authenticate } from '@/components/api/googleApi';

export default function Calendar() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [authUrl, setAuthUrl] = useState<string>('');
  
  const syncGoogleCalendar = async () => {
    try {
      const authResult = authenticate();
      if (typeof authResult === 'string') {
        setAuthUrl(authResult);
        setIsAuthorized(false);
      } else {
        console.log(`${isAuthorized ? "Unsyncing" : "Syncing"} Google Calendar...`);
        setIsAuthorized(!isAuthorized);
      }
    } catch(e) {
      setError(e); 
    }
  }

  useEffect(() => {
    console.log(`${isAuthorized ? "Synced" : "Unsynced"} Google Calendar successfully!`);
  }, [isAuthorized]);
  
  return(
    <div style={{ border: '1px solid black', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      {error && <ErrorMsg error={error} />} 
      <div>
        <h3>
          <T>Sync Your Gratheon Schedule with Google Calendar</T>
        </h3>
        <p>
          <T>Effortlessly manage your time. Sync your Gratheon tasks with Google Calendar for a centralized view and automatic updates.</T>
        </p>
      </div>
      {authUrl ? (
        <a href={authUrl}>
          <Button color='grey'>
            <T>Authorize</T>
          </Button>
        </a>
      ) : (
        <Button color='grey' onClick={syncGoogleCalendar}>
          <T>{isAuthorized ? "Disconnect" : "Connect"}</T>
        </Button>
      )}
    </div>
  );
};