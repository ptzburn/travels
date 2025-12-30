import z from "zod";

export const SearchQuerySchema = z.object({
  q: z.string().trim().min(1, "You must enter a search term"),
});
