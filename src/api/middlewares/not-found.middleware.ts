import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "~/shared/http-status.ts";

const notFound: NotFoundHandler = (c) => {
  c.var.logger.error(`An error occurred: path ${c.req.path} not found`);

  return c.json({
    success: false,
    message: `${NOT_FOUND.MESSAGE} - ${c.req.path}`,
  }, NOT_FOUND.CODE);
};

export default notFound;
