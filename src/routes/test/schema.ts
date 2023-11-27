import { object, string, minLength, isoDate, fallback } from "valibot";

export const schema = object({
  name: string([minLength(1)]),
  //birthdate: string([isoDate()]),
  date: fallback(string(), new Date().toISOString().substring(0, 10)),
});
