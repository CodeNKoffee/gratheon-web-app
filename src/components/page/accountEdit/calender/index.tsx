import { useEffect, useState } from 'react';
import Button from "@/components/shared/button";
import ErrorMsg from "@/components/shared/messageError";
import T from "@/components/shared/translate";

export default function Calendar() {
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [error, setError] = useState(null);
  
  const syncGoogleCalendar = async () => {
    try {
      console.log(`${isSynced ? "Unsyncing" : "Syncing"} Google Calendar...`);
      setTimeout(() => {
        setIsSynced(!isSynced);
      }, 5000);
    } catch(e) {
      setError(e); 
    }
  }

  useEffect(() => {
    console.log(`${isSynced ? "Synced" : "Unsynced"} Google Calendar successfully!`);
  }, [isSynced]);
  
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
      <Button 
        color='grey' 
        onClick={syncGoogleCalendar}
      >
        <T>{isSynced ? "Disconnect" : "Connect"}</T>
      </Button>
    </div>
  );
};