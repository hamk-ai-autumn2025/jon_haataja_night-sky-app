import { useState } from "react";
import Button from '../components/Button';

interface SearchFormProps {
  onSearch: (country: string, month: string, year: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [country, setCountry] = useState("Finland");
  const [month, setMonth] = useState("September");
  const [year, setYear] = useState("2025");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(country, month, year);
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label>
        Country:
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </label>

      <label>
        Month:
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>

      <label>
        Year:
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </label>

        <Button title="Search" disabled={false} type='submit' styleType='btn-primary'/>
    </form>
  );
}

export default SearchForm;
