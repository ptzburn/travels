import { z } from "@hono/zod-openapi";

import { StreamMessageType } from "~/shared/types.ts";

// Convert the TypeScript enum to Zod enum
const StreamMessageTypeSchema = z.enum(StreamMessageType);

// Base schema that matches BaseStreamMessage interface
const BaseStreamMessageSchema = z.object({
  type: StreamMessageTypeSchema,
});

// Tool input can be a stringified JSON
const ToolInputSchema = z.object({
  input: z.string().describe("Stringified JSON input for the tool"),
});

// LangChain ToolMessage format
const ToolOutputSchema = z.object({
  lc: z.number(),
  type: z.literal("constructor"),
  id: z.array(z.string()),
  kwargs: z.object({
    status: z.string(),
    content: z.string(),
    tool_call_id: z.string(),
    name: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
    additional_kwargs: z.record(z.string(), z.any()).optional(),
    response_metadata: z.record(z.string(), z.any()).optional(),
  }),
});

// Create schemas that match your existing interfaces
export const StreamMessageSchema = z.discriminatedUnion("type", [
  // ConnectedMessage
  BaseStreamMessageSchema.extend({
    type: z.literal(StreamMessageType.Connected),
  }),
  // TokenMessage
  BaseStreamMessageSchema.extend({
    type: z.literal(StreamMessageType.Token),
    token: z.string().describe("The streamed token content"),
  }),
  // ErrorMessage
  BaseStreamMessageSchema.extend({
    type: z.literal(StreamMessageType.Error),
    error: z.string().describe("Error message"),
  }),
  // DoneMessage
  BaseStreamMessageSchema.extend({
    type: z.literal(StreamMessageType.Done),
    chatId: z.string().describe("The ID of the chat that was completed"),
  }),
  // ToolStartMessage
  BaseStreamMessageSchema.extend({
    type: z.literal(StreamMessageType.ToolStart),
    tool: z.string().describe("Name of the tool being started"),
    input: ToolInputSchema.describe("Input provided to the tool"),
  }),
  // ToolEndMessage
  BaseStreamMessageSchema.extend({
    type: z.literal(StreamMessageType.ToolEnd),
    tool: z.string().describe("Name of the tool that completed"),
    output: ToolOutputSchema.describe("Output from the tool"),
  }),
]);

// Helper function to create SSE content for routes
function sseContent(description: string) {
  return {
    description,
    content: {
      "text/event-stream": {
        schema: StreamMessageSchema,
        examples: {
          connected: {
            value: { type: StreamMessageType.Connected },
          },
          token: {
            value: {
              type: StreamMessageType.Token,
              token: "Hello",
            },
          },
          toolStart: {
            value: {
              type: StreamMessageType.ToolStart,
              tool: "talent_search",
              input: {
                input: '{"query":"Node.js developer"}',
              },
            },
          },
          toolEnd: {
            value: {
              type: StreamMessageType.ToolEnd,
              tool: "talent_search",
              output: {
                lc: 1,
                type: "constructor",
                id: ["langchain_core", "messages", "ToolMessage"],
                kwargs: {
                  status: "success",
                  content:
                    "The found talents include:\n\n1. John Doe: Full-stack software engineer...",
                  tool_call_id: "call_V3kapk5sZlOCCTq73XtmLOPq",
                  name: "talent_search",
                  metadata: {},
                  additional_kwargs: {},
                  response_metadata: {},
                },
              },
            },
          },
          done: {
            value: {
              type: StreamMessageType.Done,
              chatId: "66c860000000000000000000",
            },
          },
          error: {
            value: {
              type: StreamMessageType.Error,
              error: "Stream processing failed",
            },
          },
        },
      },
    },
  };
}

export default sseContent;
