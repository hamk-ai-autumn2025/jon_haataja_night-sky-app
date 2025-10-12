import React from "react";
import { months } from "./months";

interface MonthSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  required?: boolean;
  id?: string;
}

const MonthSelect: React.FC<MonthSelectProps> = ({
  value,
  onChange,
  label = "Month",
  required = false,
}) => (
  <div className="month-select">
    <label>
      {label}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="select-field"
        aria-describedby="month-error"
        aria-required="true"
        id={"monthId"}
      >
        <option value="">Select a month</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default MonthSelect;
