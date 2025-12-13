import z from "zod";

export const AvailableTimesSchema = z.array(z.date()).openapi({
  type: "array",
  description: "Array of available times",
  example: ["2025-01-01T00:00:00.000Z", "2025-01-01T01:00:00.000Z"],
});
