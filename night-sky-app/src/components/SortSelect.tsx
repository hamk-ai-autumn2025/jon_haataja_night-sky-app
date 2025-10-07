import React from "react";

export type SortOption =
  | ""
  | "date_newest"
  | "date_oldest"
  | "title_asc"
  | "title_desc"
  | "visibility_naked_eye_first"
  | "visibility_telescope_first";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const labels: Record<Exclude<SortOption, "">, string> = {
  date_newest: "Date (Newest → Oldest)",
  date_oldest: "Date (Oldest → Newest)",
  title_asc: "Title (A → Z)",
  title_desc: "Title (Z → A)",
  visibility_naked_eye_first: "Visibility (Naked Eye First)",
  visibility_telescope_first: "Visibility (Telescope First)",
};

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="sort-select">
      <label className="select-label" aria-label="Sort by">
        <select
          className="select-field border-bottom-none"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
        >
          <option value="" id="emptyOption">
            Sort &#43;
          </option>

          {(Object.keys(labels) as Exclude<SortOption, "">[]).map((opt) => (
            <option key={opt} value={opt} className="select-field-option">
              {labels[opt]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SortSelect;
