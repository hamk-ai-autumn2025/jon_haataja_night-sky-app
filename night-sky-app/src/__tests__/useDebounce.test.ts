import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce, useDebouncedCallback } from "../hooks/useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } },
    );

    expect(result.current).toBe("initial");
    rerender({ value: "changed" });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("changed");
  });

  it("cancels previous timeout when value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } },
    );

    rerender({ value: "change1" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "change2" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: "change3" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("change3");
  });
});

describe("useDebouncedCallback hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a debounced function", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));
    expect(typeof result.current).toBe("function");
  });

  it("debounces callback execution", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("test");
    });
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(callback).toHaveBeenCalledWith("test");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels previous timeout on rapid calls", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current("call1");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => {
      result.current("call2");
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => {
      result.current("call3");
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("call3");
  });

  it("works with search input scenario", () => {
    const searchCallback = vi.fn();
    const { result } = renderHook(() =>
      useDebouncedCallback(searchCallback, 300),
    );

    const searchTerms = ["f", "fi", "fin", "finland"];
    searchTerms.forEach((term) => {
      act(() => {
        result.current(term);
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(searchCallback).toHaveBeenCalledTimes(1);
    expect(searchCallback).toHaveBeenCalledWith("finland");
  });
});
