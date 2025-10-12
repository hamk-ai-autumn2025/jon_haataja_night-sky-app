import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
// Move jest-dom import after Vitest globals
import "@testing-library/jest-dom";
import CountrySelect from "../components/CountrySelect";
import MonthSelect from "../components/MonthSelect";
import Input from "../components/Input";
import EventCard from "../components/EventCard";

describe("CountrySelect", () => {
  it("renders and allows selection", () => {
    const handleChange = vi.fn();
    render(<CountrySelect value="FI" onChange={handleChange} />);
    // Should render a select element
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    // Simulate change
    fireEvent.change(select, { target: { value: "SE" } });
    expect(handleChange).toHaveBeenCalled();
  });
});

describe("MonthSelect", () => {
  it("renders and allows selection", () => {
    const handleChange = vi.fn();
    render(<MonthSelect value="January" onChange={handleChange} required />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "February" } });
    expect(handleChange).toHaveBeenCalled();
  });
});

describe("Input", () => {
  it("renders and accepts input", () => {
    const handleChange = vi.fn();
    render(
      <Input
        label="Year"
        type="number"
        value="2025"
        onChange={handleChange}
        htmlFor="year"
        id="year"
        placeholder="2025"
        min={0}
      />,
    );
    const input = screen.getByLabelText("Year");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "2024" } });
    expect(handleChange).toHaveBeenCalled();
  });
});

describe("EventCard", () => {
  it("formats ISO date to 'MMM D' uppercase without year", () => {
    const event = {
      date: "2025-09-07",
      title: "Test Event",
      description: "A sample astronomy event.",
      visibility: "naked_eye" as const,
      tips: "Best viewed after midnight.",
    };
    render(<EventCard event={event} />);
    expect(screen.getByText("SEP 7")).toBeInTheDocument();
  });
});
