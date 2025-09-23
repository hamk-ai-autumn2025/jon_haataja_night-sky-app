import React from "react";

interface InputProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  htmlFor: string;
  id: string;
  placeholder?: string;
  min?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  htmlFor,
  id,
  placeholder,
  min,
}) => (
  <div className="form-group">
    <label htmlFor={htmlFor} className="input-label">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      id={id}
      className="input-field"
      placeholder={placeholder}
      {...(min !== undefined ? { min } : {})}
    ></input>
  </div>
);

export default Input;
