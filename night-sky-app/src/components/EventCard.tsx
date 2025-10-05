import { AstronomyEvent } from "../App";
import BloodMoonImage from "../assets/skai-blood-moon.png";
import FullMoonImage from "../assets/skai-full-moon.png";
import MeteorShowerImage from "../assets/skai-meteor-shower.png";
import SolarSystemImage from "../assets/skai-solar-system.png";
import WinterSolsticeImage from "../assets/skai-winter.png";
import SummerSolsticeImage from "../assets/skai-summer.png";
import SolarEclipseImage from "../assets/skai-solar-eclipse.png";
import BloodMoonImageTall from "../assets/skai-blood-moon-tall.png";
import FullMoonImageTall from "../assets/skai-full-moon-tall.png";
import MeteorShowerImageTall from "../assets/skai-meteor-shower-tall.png";
import SolarSystemImageTall from "../assets/skai-solar-system-tall.png";
import WinterSolsticeImageTall from "../assets/skai-winter-tall.png";
import SummerSolsticeImageTall from "../assets/skai-summer-tall.png";
import SolarEclipseImageTall from "../assets/skai-solar-eclipse-tall.png";
import EyeIcon from "../assets/eye.svg";
import TelescopeIcon from "../assets/telescope.svg";

interface EventCardProps {
  event: AstronomyEvent;
  onClick?: (event: AstronomyEvent) => void;
}

/**
 * Selects an appropriate image based on the event title content
 * @param title - The event title to analyze
 * @returns The appropriate image import
 */
function getEventImage(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Check for specific keywords in the title
  if (titleLower.includes("blood moon")) {
    return BloodMoonImage;
  } else if (titleLower.includes("full moon")) {
    return FullMoonImage;
  } else if (titleLower.includes("meteor") || titleLower.includes("meteor shower")) {
    return MeteorShowerImage;
  } else if (titleLower.includes("winter solstice")) {
    return WinterSolsticeImage;
  } else if (titleLower.includes("summer solstice")) {
    return SummerSolsticeImage;
  } else if (titleLower.includes("solar eclipse")) {
    return SolarEclipseImage;
  }
  
  // Default fallback image
  return SolarSystemImage;
}

/**
 * Selects an appropriate tall version image based on the event title content
 * @param title - The event title to analyze
 * @returns The appropriate tall image import
 */
export function getEventImageTall(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Check for specific keywords in the title
  if (titleLower.includes("blood moon")) {
    return BloodMoonImageTall;
  } else if (titleLower.includes("full moon")) {
    return FullMoonImageTall;
  } else if (titleLower.includes("meteor") || titleLower.includes("meteor shower")) {
    return MeteorShowerImageTall;
  } else if (titleLower.includes("winter solstice")) {
    return WinterSolsticeImageTall;
  } else if (titleLower.includes("summer solstice")) {
    return SummerSolsticeImageTall;
  } else if (titleLower.includes("solar eclipse")) {
    return SolarEclipseImageTall;
  }
  
  // Default fallback image
  return SolarSystemImageTall;
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
      onKeyDown={e => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick(event);
        }
      }}
    >
      <div className="position-relative">
        <img src={eventImage} alt={event.title} className=" event-card-img"/>
        <span className="position-absolute event-card-symbols">
          {event.visibility === "naked_eye" ? <img src={EyeIcon} alt="Naked Eye" /> : <img src={TelescopeIcon} alt="Telescope" />}
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
