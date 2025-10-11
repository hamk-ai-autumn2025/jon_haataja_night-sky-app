/**
 * Utility functions to generate "Add to Calendar" links for various providers
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Formats a date to YYYYMMDDTHHMMSSZ format (UTC)
 */
const formatDateForCalendar = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

/**
 * Generate Google Calendar link
 */
export const generateGoogleCalendarLink = (event: CalendarEvent): string => {
  const startDate = formatDateForCalendar(event.startDate);
  const endDate = formatDateForCalendar(event.endDate);
  
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate Outlook Calendar link (web version)
 */
export const generateOutlookCalendarLink = (event: CalendarEvent): string => {
  const startDate = event.startDate.toISOString();
  const endDate = event.endDate.toISOString();

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: startDate,
    enddt: endDate,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

/**
 * Generate Yahoo Calendar link
 */
export const generateYahooCalendarLink = (event: CalendarEvent): string => {
  const startDate = formatDateForCalendar(event.startDate);
  const endDate = formatDateForCalendar(event.endDate);
  
  const params = new URLSearchParams({
    v: "60",
    title: event.title,
    desc: event.description,
    in_loc: event.location,
    st: startDate,
    et: endDate,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
};

/**
 * Generate iCloud Calendar link (.ics file download)
 * iCloud doesn't have a direct web URL like others, so we generate an ICS file content
 * that can be downloaded and opened in iCloud Calendar or any calendar app
 */
export const generateICalendarFile = (event: CalendarEvent): string => {
  const startDate = formatDateForCalendar(event.startDate);
  const endDate = formatDateForCalendar(event.endDate);
  
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Night Sky App//NONSGML v1.0//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@nightskyapp.com`,
    `DTSTAMP:${formatDateForCalendar(new Date())}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  // Create a data URL for the ICS file
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
};

/**
 * Parse a date string in YYYY-MM-DD format and return a Date object
 * Set time to evening (20:00 local time) for night sky events
 */
export const parseEventDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Set to 8 PM local time (20:00) for evening viewing
  return new Date(year, month - 1, day, 20, 0, 0);
};

/**
 * Create a CalendarEvent object from AstronomyEvent data
 */
export const createCalendarEventFromAstronomy = (
  event: { title: string; description: string; tips: string; date: string },
  location: string
): CalendarEvent => {
  const startDate = parseEventDate(event.date);
  // End date is 3 hours later (good viewing window)
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  // Combine description and tips for the calendar event
  const fullDescription = `${event.description}\n\nViewing Tips:\n${event.tips}`;

  return {
    title: event.title,
    description: fullDescription,
    location: location,
    startDate: startDate,
    endDate: endDate,
  };
};
