// Supports weights 200-800
//@ts-expect-error ts can't find font but it still works
import "@fontsource-variable/plus-jakarta-sans";
import "./styles/App.css";
import "./styles/index.css";
import skaiLogo from "./assets/skai-logo.svg";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "./hooks/useDebounce";
import Modal from "./components/Modal";
import { SearchForm } from "./components/SearchForm";
import EventList from "./components/EventList";
import SortSelect, { SortOption } from "./components/SortSelect";
import sortEvents from "./components/sortEvents";
import getAstronomyEvents, { AstronomyEventsResponse } from "./services/openaiService";
import Footer from "./components/Footer";
import EyeIcon from "./assets/eye.svg";
import TelescopeIcon from "./assets/telescope.svg";

import { getEventImageTall } from "./components/eventImages";
import AddToCalendar from "./components/AddToCalendar";
import SkeletonEventCard from "./components/SkeletonEventCard";

export interface AstronomyEvent {
  date: string;
  title: string;
  description: string;
  visibility: "naked_eye" | "telescope";
  tips: string;
}

function App() {
  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortOption>("");
  // State to store the last searched country, month, and year
  const [searchedCountry, setSearchedCountry] = useState<string>("");
  const [searchedMonth, setSearchedMonth] = useState<string>("");
  const [searchedYear, setSearchedYear] = useState<string>("");
  
  // Cache metadata state
  const [cacheInfo, setCacheInfo] = useState<{
    fromCache: boolean;
    cacheAge?: number;
    source?: string;
  } | null>(null);
  
  // Ref to store the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // Modal state for selected event
  const [selectedEvent, setSelectedEvent] = useState<AstronomyEvent | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (event: AstronomyEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const displayedEvents = useMemo(
    () => {
      const sorted = sortEvents(events, sort);
      return sorted;
    },
    [events, sort],
  );

  // Helper to format a date string as DD.MM.YYYY for modal display only
  const formatDateForModal = (dateStr: string | undefined | null) => {
    if (!dateStr) return "";
    // Try to parse ISO-like or common date strings
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // If parsing failed, return original string as fallback
      return dateStr;
    }
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  async function handleSearch(country: string, month: string, year: string) {
    // Cancel any previous ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError("");
    setCacheInfo(null);
    setSearchedCountry(country);
    setSearchedMonth(month);
    setSearchedYear(year);
    try {
      const response: AstronomyEventsResponse = await getAstronomyEvents(
        country, 
        month, 
        year,
        abortControllerRef.current.signal
      );
      
      // Store cache metadata
      setCacheInfo({
        fromCache: response.fromCache,
        cacheAge: response.cacheAge,
        source: response.source
      });
      
      const data = response.data;
      
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && typeof data === 'object' && 'events' in data && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err: unknown) {
      // Don't show error if request was aborted (user started a new search)
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Search request was cancelled');
        return;
      }
      console.error(err);
      setError("Failed to fetch astronomy events. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  // Create debounced version of handleSearch with 300ms delay
  const debouncedHandleSearch = useDebouncedCallback(
    useCallback((country: string, month: string, year: string) => {
      handleSearch(country, month, year);
    }, []),
    300
  );

  return (
    <div className="app">
      <main>
        <div className="nav-hero-container">
          <nav>
            <input type="checkbox" id="check"></input>
            <div className="checkbtn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
              </svg>
            </div>
            <label className="logo" htmlFor="check">
              <img src={skaiLogo} alt="Skai Logo" className="logo" />
            </label>
            <ul>
              <li>
                <a className="active" href="#">
                  Home
                </a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </nav>

          <section className="container">
            <div className="col-12">
              <div className="h1-p-container">
                <h1>Never Miss a Meteor Shower Again.</h1>
                <p className="hero-p">
                  Skai is an AI powered service that will tell you what’s
                  happening in the night sky of your country.
                </p>
              </div>

              <div className="glass-card">
                <SearchForm onSearch={debouncedHandleSearch} />
              </div>
            </div>
          </section>
        </div>

        <section className="container">
          <div className="col-12">
            {loading && (
              <div className="col-12">
                <div className="flex">
                  <div className="col-12 w-100 text-center justify-center align-items-center">
                    {/* <p className="loading-subtext">Please wait while we fetch astronomy data</p> */}
                    <span className="loader"></span>
                  </div>
                </div>
                <div className="container pt-3">
                  <SkeletonEventCard count={9} />
                </div>
              </div>
            )}
            {error && <p className="error">{error}</p>}

            {!loading && events.length > 0 && (
              <div className="col-12">
                {/* Cache indicator badge */}
                {cacheInfo && cacheInfo.fromCache && (
                  <div className="cache-indicator">
                    ⚡ Instant results from cache
                    {cacheInfo.cacheAge && cacheInfo.cacheAge > 0 && (
                      <span className="cache-age">
                        {" "}• Cached {Math.floor(cacheInfo.cacheAge / 1000 / 60)} minutes ago
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex">
                  <div className="col-7 w-100">
                    <h2 className="symbols-h2">
                      {searchedMonth && searchedYear && searchedCountry
                        ? `${searchedMonth} ${searchedYear} events in ${searchedCountry}:`
                        : "Astronomy Events"}
                    </h2>
                    <h3>Symbol explanations:</h3>
                    <p className="symbol-explanations">
                      <span className="symbol-eye">
                        <img src={EyeIcon} alt="Naked Eye" />
                      </span>
                      Visible with the naked eye
                    </p>
                    <p>
                      <span className="symbol-telescope">
                        <img src={TelescopeIcon} />
                      </span>
                      Requires a telescope
                    </p>
                  </div>
                  <div className="col-5 flex justify-end align-items-end w-50">
                    <SortSelect value={sort} onChange={setSort} />
                  </div>
                </div>

                <EventList
                  events={displayedEvents}
                  onCardClick={handleCardClick}
                />
              </div>
            )}
          </div>
        </section>

        <section className="footer">
          <Footer />
        </section>
        {/* Modal for event details */}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          {selectedEvent && (
            <div className="container margin-0">
              <div className="col-7 modal-text">
                <h2>{selectedEvent.title}</h2>
                <div className="container">
                  <div className="col-6">
                    <h3 className="modal-subtitle">Date</h3>
                    <p className="modal-paragraph">
                      {formatDateForModal(selectedEvent.date)}
                    </p>
                  </div>

                  <div className="col-6">
                    <h3 className="modal-subtitle">Visibility</h3>
                    <p className="modal-paragraph">
                      {selectedEvent.visibility === "naked_eye"
                        ? "Naked Eye"
                        : "Telescope"}
                    </p>
                  </div>

                  <div className="col-12">
                    <h3 className="modal-subtitle">Description</h3>
                    <p className="modal-paragraph">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="col-12">
                    <h3 className="modal-subtitle">Tips for Best Viewing</h3>
                    <p className="modal-paragraph">{selectedEvent.tips}</p>
                  </div>

                  <div className="col-12">
                    <AddToCalendar
                      event={selectedEvent}
                      location={searchedCountry || "Your location"}
                    />
                  </div>
                </div>
              </div>

              <div className="col-5">
                <img
                  src={getEventImageTall(selectedEvent.title)}
                  alt={`Tall ${selectedEvent.title} Image`}
                  className="modal-image"
                />
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

export default App;
