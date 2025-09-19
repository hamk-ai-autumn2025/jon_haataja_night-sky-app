import axios from "axios";
import { AstronomyEvent } from "../App";

export async function getAstronomyEvents(
  country: string,
  month: string,
  year: string
): Promise<AstronomyEvent[]> {
  const res = await axios.post("/api/astronomy-events", {
    country,
    month,
    year,
  });

  return res.data;
}
export default getAstronomyEvents;
