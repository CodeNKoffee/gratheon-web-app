import Button from "@/components/shared/button";

export default function Calendar() {
  return(
    <div className="w-full rounded-sm flex justify-between items-center">
      <div class="w-1/2">
        <h4>
          Never Miss a Beat: Sync Your Gratheon Schedule with Google Calendar
        </h4>
        <p>
          Effortlessly manage your time. Sync your Gratheon tasks with Google Calendar for a centralized view and automatic updates. Stay on top of everything, always.
        </p>
      </div>
      <div className="w-1/2">
        <Button
          title="Connect"
        />
      </div>
    </div>
  );
};
