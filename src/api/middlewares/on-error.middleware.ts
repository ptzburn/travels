import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { HTTPException } from "hono/http-exception";

import env from "~/env.ts";
import * as httpStatus from "~/shared/http-status.ts";

const onError: ErrorHandler = (error, c) => {
  const currentCode = "code" in error ? error.code : null;

  let currentStatus = c.newResponse(null).status;

  if ("status" in error) {
    currentStatus = error.status as number;
  } else if (currentCode === 11000) {
    currentStatus = 409;
  }

  const statusCode = currentStatus !== httpStatus.OK.CODE
    ? (currentStatus as ContentfulStatusCode)
    : httpStatus.INTERNAL_SERVER_ERROR.CODE;
  const environment = env.NODE_ENV;

  if (error instanceof HTTPException) {
    if (error.status === httpStatus.UNPROCESSABLE_ENTITY.CODE) {
      return c.json({
        success: false,
        errors: [{
          message: error.message,
        }],
        stack: environment === "production" ? undefined : error.stack,
      }, error.status);
    }
    return c.json({
      success: false,
      message: error.message,
      stack: environment === "production" ? undefined : error.stack,
    }, error.status);
  }

  if (error instanceof Error) {
    let errorMessage = error.message;

    if (error.message.includes("locations index: user_1_name_1")) {
      errorMessage = "A location with that name already exists";
    }

    return c.json({
      success: false,
      message: errorMessage,
      stack: environment === "production" ? undefined : error.stack,
    }, statusCode);
  }

  return c.json(
    { success: false, message: httpStatus.INTERNAL_SERVER_ERROR.MESSAGE },
    httpStatus.INTERNAL_SERVER_ERROR.CODE,
  );
};

export default onError;
