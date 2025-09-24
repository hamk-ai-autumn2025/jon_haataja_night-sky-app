import { useState } from "react";
import CountrySelect from "./CountrySelect";
import Button from "../components/Button";
import Input from "../components/Input";
import MonthSelect from "./MonthSelect";

interface SearchFormProps {
  onSearch: (country: string, month: string, year: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const currentYear = new Date().getFullYear();
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentYear.toString());
  const [errors, setErrors] = useState<{
    country?: string;
    month?: string;
    year?: string;
  }>({});

  // Helper to validate month (accepts full month names, case-insensitive)
  const validMonths = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  function validate() {
    const newErrors: { country?: string; month?: string; year?: string } = {};
    if (!country) {
      newErrors.country = "Please select a country.";
    }
    if (!month || !validMonths.includes(month.trim().toLowerCase())) {
      newErrors.month = "Enter a valid month name.";
    }
    if (!year || !/^\d{4}$/.test(year.trim())) {
      newErrors.year = "Enter a valid 4-digit year.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSearch(country, month, year);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-form container gap-3" noValidate>
      <div className="col-3">
      <CountrySelect
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      
      {errors.country && <div className="error-message">{errors.country}</div>}
      </div>
      <div className="col-3">
        <MonthSelect
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        {errors.month && <div className="error-message">{errors.month}</div>}
      </div>
      <div className="col-3">
        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => {
            const val = e.target.value;
            // Only allow non-negative numbers
            if (/^\d*$/.test(val)) {
              setYear(val);
            }
          }}
          htmlFor="year"
          id="year"
          placeholder={currentYear.toString()}
          min={0}
        />
        {errors.year && <div className="error-message">{errors.year}</div>}
      </div>
      <div className="col-3">
        <Button
          title="Search"
          disabled={
            !country ||
            !month ||
            !year ||
            !validMonths.includes(month.trim().toLowerCase()) ||
            !/^\d{4}$/.test(year.trim())
          }
          type="submit"
          styleType="btn-primary"
        />
      </div>
    </form>
  );
}

export default SearchForm;
