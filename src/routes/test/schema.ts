import { minLength, object, string } from "valibot";

export const schema = object({
  name: string([minLength(1)]),
});
