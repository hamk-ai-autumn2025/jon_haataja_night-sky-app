// Supports weights 200-800
//@ts-expect-error ts can't find font but it still works
import '@fontsource-variable/plus-jakarta-sans';
import './App.css'
import './index.css'
import nightyLogo from './assets/nighty-logo.svg'
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
      const data: AstronomyEvent[] = await getAstronomyEvents(country, month, year);
      if (Array.isArray(data)) {
        setEvents(data);
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

    <nav>
        <input type="checkbox" id="check"></input>
        <div className="checkbtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>        
        </div>
        <label className="logo" htmlFor="check">
        <img src={nightyLogo} alt="Nighty Logo" className='Nighty logo' />
        </label>
        <ul>
            <li><a className="active" href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>

    <main className="container">
      <section className="col-12">

        <div className='h1-p-container'>
          <h1>Never Miss a Meteor Shower Again.</h1>
          <p className='hero-p'>
            Nighty is an AI powered service that will tell you what’s happening in
            the night sky of your country.
          </p>
        </div>

        <div className="glass-card">
          <SearchForm onSearch={handleSearch} />
          {error && <p className="error">{error}</p>}
          {loading && <p>Loading events...</p>}
        </div>

        <div>
          {!loading && events.length > 0 && <EventList events={events} />}
        </div>

      </section>

    </main>

    </div>
  );
}

export default App;
