import { AstronomyEvent } from "../App";
import EventCard from "./EventCard";

interface EventListProps {
  events: AstronomyEvent[];
}

function EventList({ events }: EventListProps) {
  return (
    <div className="container mt-4 mb-4">
      {events.map((ev, idx) => (
        <EventCard key={idx} event={ev} />
      ))}
    </div>
  );
}

export default EventList;