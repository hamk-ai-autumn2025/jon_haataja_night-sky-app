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
  <div>
    <label htmlFor={htmlFor}>
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        id={id}
        className="input-field"
        placeholder={placeholder}
        {...(min !== undefined ? { min } : {})}
      ></input>
    </label>
  </div>
);

export default Input;
