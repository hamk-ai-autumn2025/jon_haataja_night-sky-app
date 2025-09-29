import { AstronomyEvent } from "../App";

interface EventCardProps {
  event: AstronomyEvent;
}

function EventCard({ event }: EventCardProps) {
  return (
    <div className="event-card col-4">
      <p className="date">{event.date}</p>
      <h4>{event.title}</h4>
      <p>{event.description}</p>
      <span>
        {event.visibility === "naked_eye" ? "👁️ Naked Eye" : "🔭 Telescope"}
      </span>
    </div>
  );
}

export default EventCard;
