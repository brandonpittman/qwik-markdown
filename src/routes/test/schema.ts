import { object, string, minLength, date, coerce, isoDate } from "valibot";

export const schema = object({
  name: string([minLength(1)]),
  birthdate: string([isoDate()]),
});
