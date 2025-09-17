import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

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
        <Input
          label="Country:"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          htmlFor="country" 
          id="country"
        />
        <Input
          label="Month:"
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          htmlFor="month"
          id="month"
        />
        <Input
          label="Year:"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          htmlFor="year"
          id="year"
        />
        <Button title="Search" disabled={false} type="submit" styleType="btn-primary" />
      </form>
  );
}

export default SearchForm;
