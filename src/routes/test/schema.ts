import { object, string, minLength, date, coerce } from "valibot";

export const schema = object({
  name: string([minLength(1)]),
  birthdate: coerce(date(), (i) => new Date(i as string | number | Date)),
});
