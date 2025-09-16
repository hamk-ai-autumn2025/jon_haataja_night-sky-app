import { AstronomyEvent } from "../App";
import EventCard from "./EventCard";

interface EventListProps {
  events: AstronomyEvent[];
}

function EventList({ events }: EventListProps) {
  return (
    <div className="event-list">
      {events.map((ev, idx) => (
        <EventCard key={idx} event={ev} />
      ))}
    </div>
  );
}

export default EventList;