import { AstronomyEvent } from "../App";
import EventCard from "./EventCard";

interface EventListProps {
  events: AstronomyEvent[];
  onCardClick?: (event: AstronomyEvent) => void;
}

function EventList({ events, onCardClick }: EventListProps) {
  return (
    <div className="container pt-3">
      {events.map((ev, idx) => (
        <EventCard key={idx} event={ev} onClick={onCardClick} />
      ))}
    </div>
  );
}

export default EventList;
