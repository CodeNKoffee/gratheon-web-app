import React, { useState } from 'react'; // Import React and useState hook
import Button from "@/components/shared/button";
import ErrorMsg from "@/components/shared/messageError";
import T from "@/components/shared/translate";
import "./Calendar.css"

export default function Calendar() {
  const [error, setError] = useState(null); // Initialize state for error

  const syncGoogleCalendar = async () => {
    try {
      console.log('syncing google calendar');
      // Here you would add the logic to sync with Google Calendar
    } catch(e) {
      setError(e); // Set error state if an exception occurs
    }
  }
  
  return(
    <div style={{ border: '2px solid black', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      {error && <ErrorMsg error={error} />} 
      <div>
        <h3>
          <T>Never Miss a Beat: Sync Your Gratheon Schedule with Google Calendar</T>
        </h3>
        <p>
          <T>Effortlessly manage your time. Sync your Gratheon tasks with Google Calendar for a centralized view and automatic updates.</T>
        </p>
      </div>
      <Button 
        color='blue' 
        onClick={syncGoogleCalendar}
      >
        <T>Connect</T>
      </Button>
    </div>
  );
};