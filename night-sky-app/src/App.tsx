// Supports weights 200-800
//@ts-expect-error ts can't find font but it still works
import '@fontsource-variable/plus-jakarta-sans';
import './App.css'
import './index.css'
import { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import EventList from "./components/EventList";
import getAstronomyEvents from "./services/openaiService";

export interface AstronomyEvent {
  date: string;
  title: string;
  description: string;
  visibility: "naked_eye" | "telescope";
}

function App() {
  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(country: string, month: string, year: string) {
    setLoading(true);
    setError("");
    try {
      const data = await getAstronomyEvents(country, month, year);
      // Handle both array and object response formats
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch astronomy events. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Never Miss a Meteor Shower Again.</h1>
      <p>
        Nighty is an AI powered service that will tell you what’s happening in
        the night sky of your country.
      </p>

      <SearchForm onSearch={handleSearch} />

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && events.length > 0 && <EventList events={events} />}
    </div>
  );
}

export default App;
