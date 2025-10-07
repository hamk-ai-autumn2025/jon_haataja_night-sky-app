import BloodMoonImage from "../assets/skai-blood-moon.png";
import FullMoonImage from "../assets/skai-full-moon.png";
import MeteorShowerImage from "../assets/skai-meteor-shower.png";
import SolarSystemImage from "../assets/skai-solar-system.png";
import WinterSolsticeImage from "../assets/skai-winter.png";
import SummerSolsticeImage from "../assets/skai-summer.png";
import SolarEclipseImage from "../assets/skai-solar-eclipse.png";
import BloodMoonImageTall from "../assets/skai-blood-moon-tall.png";
import FullMoonImageTall from "../assets/skai-full-moon-tall.png";
import MeteorShowerImageTall from "../assets/skai-meteor-shower-tall.png";
import SolarSystemImageTall from "../assets/skai-solar-system-tall.png";
import WinterSolsticeImageTall from "../assets/skai-winter-tall.png";
import SummerSolsticeImageTall from "../assets/skai-summer-tall.png";
import SolarEclipseImageTall from "../assets/skai-solar-eclipse-tall.png";

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

  // Default fallback image
  return SolarSystemImageTall;
}
