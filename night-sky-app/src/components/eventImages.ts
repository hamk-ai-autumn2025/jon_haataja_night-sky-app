import BloodMoonImage from "../assets/skai-blood-moon.webp";
import FullMoonImage from "../assets/skai-full-moon.webp";
import MeteorShowerImage from "../assets/skai-meteor-shower.webp";
import SolarSystemImage from "../assets/skai-solar-system.webp";
import WinterSolsticeImage from "../assets/skai-winter.webp";
import SummerSolsticeImage from "../assets/skai-summer.webp";
import SolarEclipseImage from "../assets/skai-solar-eclipse.webp";
import BloodMoonImageTall from "../assets/skai-blood-moon-tall.webp";
import FullMoonImageTall from "../assets/skai-full-moon-tall.webp";
import MeteorShowerImageTall from "../assets/skai-meteor-shower-tall.webp";
import SolarSystemImageTall from "../assets/skai-solar-system-tall.webp";
import WinterSolsticeImageTall from "../assets/skai-winter-tall.webp";
import SummerSolsticeImageTall from "../assets/skai-summer-tall.webp";
import SolarEclipseImageTall from "../assets/skai-solar-eclipse-tall.webp";
import CometImage from "../assets/skai-comet.webp";
import CometImageTall from "../assets/skai-comet-tall.webp";

/**
 * Selects an appropriate image based on the event title content
 * @param title - The event title to analyze
 * @returns The appropriate image import
 */
export function getEventImage(title: string): string {
  const titleLower = title.toLowerCase();

  // Check for specific keywords in the title
  if (titleLower.includes("blood moon")) {
    return BloodMoonImage;
  } else if (titleLower.includes("full moon")) {
    return FullMoonImage;
  } else if (
    titleLower.includes("meteor") ||
    titleLower.includes("meteor shower")
  ) {
    return MeteorShowerImage;
  } else if (titleLower.includes("winter solstice")) {
    return WinterSolsticeImage;
  } else if (titleLower.includes("summer solstice")) {
    return SummerSolsticeImage;
  } else if (titleLower.includes("solar eclipse")) {
    return SolarEclipseImage;
  }
  else if (titleLower.includes("comet")) {
    return CometImage;
  }

  // Default fallback image
  return SolarSystemImage;
}

/**
 * Selects an appropriate tall version image based on the event title content
 * @param title - The event title to analyze
 * @returns The appropriate tall image import
 */
export function getEventImageTall(title: string): string {
  const titleLower = title.toLowerCase();

  // Check for specific keywords in the title
  if (titleLower.includes("blood moon")) {
    return BloodMoonImageTall;
  } else if (titleLower.includes("full moon")) {
    return FullMoonImageTall;
  } else if (
    titleLower.includes("meteor") ||
    titleLower.includes("meteor shower")
  ) {
    return MeteorShowerImageTall;
  } else if (titleLower.includes("winter solstice")) {
    return WinterSolsticeImageTall;
  } else if (titleLower.includes("summer solstice")) {
    return SummerSolsticeImageTall;
  } else if (titleLower.includes("solar eclipse")) {
    return SolarEclipseImageTall;
  }
  else if (titleLower.includes("comet")) {
    return CometImageTall;
  }

  // Default fallback image
  return SolarSystemImageTall;
}
