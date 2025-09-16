import { AstronomyEvent } from "../App";

interface EventCardProps {
  event: AstronomyEvent;
}

function EventCard({ event }: EventCardProps) {
  return (
    <div className="event-card">
      <p className="date">{event.date}</p>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <span>
        {event.visibility === "naked_eye" ? "👁️ Naked Eye" : "🔭 Telescope"}
      </span>
    </div>
  );
}

export default EventCard;