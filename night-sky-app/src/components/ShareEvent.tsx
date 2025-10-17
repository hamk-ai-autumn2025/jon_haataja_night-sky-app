import React, { useState, useRef, useEffect } from "react";
import { AstronomyEvent } from "../App";
import "../styles/App.css";

interface ShareEventProps {
  event: AstronomyEvent;
  location: string;
}

type ShareProvider = "native" | "email" | "twitter" | "whatsapp" | "copy";

const ShareEvent: React.FC<ShareEventProps> = ({ event, location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Format date for display
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      // Fallback to original string
    }
    return dateStr;
  };

  // Generate shareable text
  const generateShareText = (): string => {
    return `🌌 ${event.title}\n\n📅 ${formatDate(event.date)}\n📍 ${location}\n\n${event.description}\n\n💡 Tip: ${event.tips}`;
  };

  // Generate shareable URL (current page)
  const getShareUrl = (): string => {
    return window.location.href;
  };

  const handleShare = async (provider: ShareProvider) => {
    const shareText = generateShareText();
    const shareUrl = getShareUrl();
    const subject = `${event.title} - Astronomy Event`;

    try {
      switch (provider) {
        case "native":
          // Use Web Share API if available
          if (navigator.share) {
            await navigator.share({
              title: event.title,
              text: shareText,
              url: shareUrl,
            });
          } else {
            // Fallback to copy
            await navigator.clipboard.writeText(
              `${shareText}\n\nView more at: ${shareUrl}`,
            );
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          }
          break;

        case "email": {
          const emailBody = encodeURIComponent(
            `${shareText}\n\nView more astronomy events at: ${shareUrl}`,
          );
          const emailSubject = encodeURIComponent(subject);
          window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
          break;
        }

        case "twitter": {
          const twitterText = encodeURIComponent(
            `🌌 ${event.title} - ${formatDate(event.date)} in ${location}\n\n${event.description.substring(0, 100)}...`,
          );
          window.open(
            `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
          );
          break;
        }

        case "whatsapp": {
          const whatsappText = encodeURIComponent(
            `${shareText}\n\nView more at: ${shareUrl}`,
          );
          window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
          break;
        }

        case "copy": {
          await navigator.clipboard.writeText(
            `${shareText}\n\nView more at: ${shareUrl}`,
          );
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          break;
        }
      }

      // Close dropdown after sharing (except for copy, which shows feedback)
      if (provider !== "copy") {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: try to copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${shareText}\n\nView more at: ${shareUrl}`,
        );
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
      }
    }
  };

  return (
    <div className="share-event-container" ref={dropdownRef}>
      <button
        className="share-event-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Share event"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share Event
      </button>

      {isOpen && (
        <div className="share-dropdown">
          {/* Check if Web Share API is supported */}
          {"share" in navigator && (
            <button
              className="share-dropdown-item"
              onClick={() => handleShare("native")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share...
            </button>
          )}

          <button
            className="share-dropdown-item"
            onClick={() => handleShare("email")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Email
          </button>

          <button
            className="share-dropdown-item"
            onClick={() => handleShare("twitter")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </button>

          <button
            className="share-dropdown-item"
            onClick={() => handleShare("whatsapp")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </button>

          <button
            className="share-dropdown-item"
            onClick={() => handleShare("copy")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copySuccess ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareEvent;
