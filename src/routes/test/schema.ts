import { isoDate, minLength, object, string } from "valibot";

export const schema = object({
  name: string([minLength(1)]),
  date: string([isoDate("ISO date required")]),
});
