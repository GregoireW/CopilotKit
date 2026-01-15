/**
 * Copilot Runtime adapter for Google Generative AI (e.g. Gemini).
 *
 * ## Example
 *
 * ```ts
 * import { CopilotRuntime, GoogleGenerativeAIAdapter } from "@copilotkit/runtime";
 * const { GoogleGenerativeAI } = require("@google/generative-ai");
 *
 * const genAI = new GoogleGenerativeAI(process.env["GOOGLE_API_KEY"]);
 *
 * const copilotKit = new CopilotRuntime();
 *
 * return new GoogleGenerativeAIAdapter({ model: "gemini-2.5-flash", apiVersion: "v1" });
 * ```
 */
import { LangChainAdapter } from "../langchain/langchain-adapter";

interface GoogleVertexAdapterOptions {
  /**
   * A custom Google Generative AI model to use.
   */
  model?: string;
}

const DEFAULT_MODEL = "gemini-2.5-flash";

export class GoogleVertexAdapter extends LangChainAdapter {
  public provider = "vertex";
  public model: string = DEFAULT_MODEL;

  constructor(options?: GoogleVertexAdapterOptions) {
    super({
      chainFn: async ({ messages, tools, threadId }) => {
        // Lazy require for optional peer dependencies
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { ChatVertexAI } = require("@langchain/google-vertexai");
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { AIMessage } = require("@langchain/core/messages");

        // Filter out empty assistant messages to prevent Gemini validation errors
        // Gemini specifically rejects conversations containing AIMessages with empty content
        const filteredMessages = messages.filter((message) => {
          // Keep all non-AI messages (HumanMessage, SystemMessage, ToolMessage, etc.)
          if (!(message instanceof AIMessage)) {
            return true;
          }

          // For AIMessages, only keep those with non-empty content
          // Also keep AIMessages with tool_calls even if content is empty
          const aiMsg = message as any;
          return (
            (aiMsg.content && String(aiMsg.content).trim().length > 0) ||
            (aiMsg.tool_calls && aiMsg.tool_calls.length > 0)
          );
        });

        this.model = options?.model ?? DEFAULT_MODEL;
        const model = new ChatVertexAI({
          modelName: this.model,
        }).bindTools(tools);

        return model.stream(filteredMessages, { metadata: { conversation_id: threadId } });
      },
    });
  }
}
