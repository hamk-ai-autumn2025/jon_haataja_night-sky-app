import { AstronomyEvent } from "../App";
import { getEventImage } from "./eventImages";
import EyeIcon from "../assets/eye.svg";
import TelescopeIcon from "../assets/telescope.svg";

interface EventCardProps {
  event: AstronomyEvent;
  onClick?: (event: AstronomyEvent) => void;
}

function EventCard({ event, onClick }: EventCardProps) {
  // Expect event.date to be an ISO-like string (YYYY-MM-DD) or parseable by Date.
  // We display it as 'MMM D' in uppercase (e.g., 'SEP 7').
  let formattedDate = event.date;
  try {
    // Try to parse common formats; split first to avoid timezone offset issues.
    // If format is already 'YYYY-MM-DD', construct date parts manually.
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(event.date);
    if (isoMatch) {
      const [, , month, day] = isoMatch; // ignore year
      const monthIndex = parseInt(month, 10) - 1;
      const dayNum = parseInt(day, 10);
      const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      formattedDate = `${monthNames[monthIndex]} ${dayNum}`;
    } else {
      const d = new Date(event.date);
      if (!isNaN(d.getTime())) {
        const monthNames = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];
        formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      }
    }
  } catch {
    // fallback silently keeps original event.date
  }

  const eventImage = getEventImage(event.title);

  return (
    <div
      className="event-card col-4"
      style={{ cursor: onClick ? "pointer" : undefined }}
      onClick={() => onClick && onClick(event)}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick(event);
        }
      }}
    >
      <div className="position-relative">
        <img src={eventImage} alt={event.title} className=" event-card-img" />
        <span className="position-absolute event-card-symbols">
          {event.visibility === "naked_eye" ? (
            <img src={EyeIcon} alt="Naked Eye" />
          ) : (
            <img src={TelescopeIcon} alt="Telescope" />
          )}
        </span>
      </div>
      <div className="event-card-content">
        <div className="container flex gap-2">
          <div className="col-3 date-wrapper">
            <p className="date">{formattedDate}</p>
          </div>
          <div className="col-9 w-100">
            <h4 className="event-card-title">{event.title}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
