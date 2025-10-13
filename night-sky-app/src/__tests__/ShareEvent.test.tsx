import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShareEvent from "../components/ShareEvent";
import { AstronomyEvent } from "../App";

describe("ShareEvent Component", () => {
  const mockEvent: AstronomyEvent = {
    date: "2025-11-17",
    title: "Leonid Meteor Shower",
    description: "Annual meteor shower from Leo constellation",
    visibility: "naked_eye",
    tips: "Best viewed after midnight in dark locations",
  };

  const mockLocation = "Finland";

  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });

    // Mock window.open
    global.open = vi.fn();
  });

  it("renders the share button", () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveTextContent("Share Event");
  });

  it("toggles dropdown when clicked", () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Initially dropdown should not be visible
    expect(screen.queryByText("Email")).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(shareButton);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Copy to Clipboard")).toBeInTheDocument();

    // Click to close
    fireEvent.click(shareButton);
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  it("opens email client when email option is clicked", () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Click email option
    const emailButton = screen.getByText("Email");
    fireEvent.click(emailButton);

    // Verify window.open was called with mailto link
    expect(window.open).toHaveBeenCalled();
    const mockOpen = window.open as ReturnType<typeof vi.fn>;
    const callArgs = mockOpen.mock.calls[0][0] as string;
    expect(callArgs).toContain("mailto:");
    expect(callArgs).toContain("Leonid%20Meteor%20Shower");
  });

  it("opens Twitter when twitter option is clicked", () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Click Twitter option
    const twitterButton = screen.getByText("Twitter");
    fireEvent.click(twitterButton);

    // Verify window.open was called with Twitter URL
    expect(window.open).toHaveBeenCalled();
    const mockOpen = window.open as ReturnType<typeof vi.fn>;
    const callArgs = mockOpen.mock.calls[0][0] as string;
    expect(callArgs).toContain("twitter.com/intent/tweet");
  });

  it("opens WhatsApp when whatsapp option is clicked", () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Click WhatsApp option
    const whatsappButton = screen.getByText("WhatsApp");
    fireEvent.click(whatsappButton);

    // Verify window.open was called with WhatsApp URL
    expect(window.open).toHaveBeenCalled();
    const mockOpen = window.open as ReturnType<typeof vi.fn>;
    const callArgs = mockOpen.mock.calls[0][0] as string;
    expect(callArgs).toContain("wa.me");
  });

  it("copies to clipboard when copy option is clicked", async () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Click copy option
    const copyButton = screen.getByText("Copy to Clipboard");
    fireEvent.click(copyButton);

    // Verify clipboard.writeText was called
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    // Verify the copied text contains event details
    const mockClipboard = navigator.clipboard.writeText as ReturnType<typeof vi.fn>;
    const copiedText = mockClipboard.mock.calls[0][0];
    expect(copiedText).toContain("Leonid Meteor Shower");
    expect(copiedText).toContain("Finland");
    expect(copiedText).toContain("Best viewed after midnight");
  });

  it("shows 'Copied!' feedback after copying", async () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Click copy option
    const copyButton = screen.getByText("Copy to Clipboard");
    fireEvent.click(copyButton);

    // Should show "Copied!" feedback
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <ShareEvent event={mockEvent} location={mockLocation} />
        <div data-testid="outside">Outside element</div>
      </div>,
    );

    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);
    expect(screen.getByText("Email")).toBeInTheDocument();

    // Click outside
    const outsideElement = screen.getByTestId("outside");
    fireEvent.mouseDown(outsideElement);

    // Dropdown should close
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  it("shows native share option if Web Share API is supported", () => {
    // Mock Web Share API support
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: vi.fn(() => Promise.resolve()),
    });

    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Should show native share option
    expect(screen.getByText("Share...")).toBeInTheDocument();
  });

  it("formats date correctly in share text", async () => {
    render(<ShareEvent event={mockEvent} location={mockLocation} />);
    const shareButton = screen.getByLabelText("Share event");

    // Open dropdown
    fireEvent.click(shareButton);

    // Click copy option
    const copyButton = screen.getByText("Copy to Clipboard");
    fireEvent.click(copyButton);

    // Verify the date is formatted
    await waitFor(() => {
      const mockClipboard = navigator.clipboard.writeText as ReturnType<typeof vi.fn>;
      const copiedText = mockClipboard.mock.calls[0][0];
      expect(copiedText).toMatch(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/);
      expect(copiedText).toContain("2025");
    });
  });
});
