import countries from "world-countries";

interface CountrySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const countryNames = countries.map((c) => c.name.common).sort();

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div className="col-3">
      <label htmlFor="country" className="select-label">
        Country
      </label>
      <select
        id="country"
        value={value}
        onChange={onChange}
        className="select-field"
        autoComplete="true"
      >
        <option value="" className="default-option">
          Select a country
        </option>
        {countryNames.map((name) => (
          <option key={name} value={name} className="select-field-option">
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountrySelect;
