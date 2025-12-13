import { z } from "@hono/zod-openapi";

const ImageFileSchema = z.object({
  file: z.instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      {
        message: "Invalid file type. Only images are allowed.",
      },
    )
    .refine(
      (file) => file.size <= 2 * 1024 * 1024, // 2MB
      {
        message: "File too large. Maximum size is 2MB.",
      },
    )
    .openapi({
      type: "string",
      format: "binary",
    }),
});

export default ImageFileSchema;
