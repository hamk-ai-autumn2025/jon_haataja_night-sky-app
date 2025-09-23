import countries from "world-countries";

interface CountrySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const countryNames = countries.map((c) => c.name.common).sort();

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div>
      <label>
        Country
      <select
        id="country"
        value={value}
        onChange={onChange}
        className="select-field"
        autoComplete="true"
      >
        <option value="">
          Select a country
        </option>
        {countryNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      </label>
    </div>
  );
}

export default CountrySelect;
