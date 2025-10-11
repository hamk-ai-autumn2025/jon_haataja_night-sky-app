import React, { useState, useRef, useEffect } from "react";
import {
  generateGoogleCalendarLink,
  generateOutlookCalendarLink,
  generateYahooCalendarLink,
  generateICalendarFile,
  createCalendarEventFromAstronomy,
} from "../utils/calendarLinks";
import "../styles/App.css";

interface AddToCalendarProps {
  event: {
    title: string;
    description: string;
    tips: string;
    date: string;
  };
  location: string;
}

type CalendarProvider = "google" | "outlook" | "yahoo" | "ical";

const AddToCalendar: React.FC<AddToCalendarProps> = ({ event, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCalendarClick = (provider: CalendarProvider) => {
    const calendarEvent = createCalendarEventFromAstronomy(event, location);

    let url = "";
    let shouldDownload = false;
    let filename = "";

    switch (provider) {
      case "google":
        url = generateGoogleCalendarLink(calendarEvent);
        break;
      case "outlook":
        url = generateOutlookCalendarLink(calendarEvent);
        break;
      case "yahoo":
        url = generateYahooCalendarLink(calendarEvent);
        break;
      case "ical":
        url = generateICalendarFile(calendarEvent);
        shouldDownload = true;
        filename = `${event.title.replace(/\s+/g, "_")}.ics`;
        break;
    }

    if (shouldDownload) {
      // Download ICS file for iCloud/iCal
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Open calendar provider in new tab
      window.open(url, "_blank", "noopener,noreferrer");
    }

    setIsOpen(false);
  };

  return (
    <div className="add-to-calendar-container" ref={dropdownRef}>
      <button
        className="add-to-calendar-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
          style={{ marginRight: "8px" }}
        >
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
          <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
        </svg>
        Add to Calendar
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 16 16"
          style={{ marginLeft: "8px" }}
          className={isOpen ? "dropdown-arrow-up" : "dropdown-arrow-down"}
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="calendar-dropdown">
          <button
            className="calendar-option"
            onClick={() => handleCalendarClick("google")}
          >
            <span className="calendar-icon">📧</span>
            Gmail
          </button>
          <button
            className="calendar-option"
            onClick={() => handleCalendarClick("outlook")}
          >
            <span className="calendar-icon">📅</span>
            Outlook
          </button>
          <button
            className="calendar-option"
            onClick={() => handleCalendarClick("yahoo")}
          >
            <span className="calendar-icon">📮</span>
            Yahoo Mail
          </button>
          <button
            className="calendar-option"
            onClick={() => handleCalendarClick("ical")}
          >
            <span className="calendar-icon">🍎</span>
            iCloud
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCalendar;
