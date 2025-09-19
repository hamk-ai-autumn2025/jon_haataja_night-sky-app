import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

interface SearchFormProps {
  onSearch: (country: string, month: string, year: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(country, month, year);
  }

  return (
      <form onSubmit={handleSubmit} className="search-form container">
        <div className="col-3">
          <Input
            label="Country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            htmlFor="country" 
            id="country"
            placeholder="Enter country name"
          />
        </div>
        <div className="col-3">
          <Input
            label="Month"
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            htmlFor="month"
            id="month"
            placeholder="Enter month name"
          />
        </div>
        <div className="col-3">
        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          htmlFor="year"
          id="year"
          placeholder="Enter year"
        />
        </div>
        <div className="col-3">
          <Button title="Search" disabled={false} type="submit" styleType="btn-primary" />
        </div>
      </form>
  );
}

export default SearchForm;
