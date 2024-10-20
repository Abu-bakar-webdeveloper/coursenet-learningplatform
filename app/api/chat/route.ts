import { google } from "@ai-sdk/google";
import { streamText, StreamData } from "ai";
import { index } from "@/lib/pineconeClient";
import { generateEmbedding } from "@/lib/emdeddings";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].content;

    // Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(lastUserMessage);

    // Query Pinecone
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    // Extract relevant context from Pinecone results
    const context = queryResponse.matches
      .map(match => match.metadata?.content as string)
      .join('\n');

    // Add system message and context to the conversation
    const systemMessage = {
      role: "system",
      content: `You are a concise assistant for an online learning platform. Please keep responses short and informative. Use the following context to inform your responses: ${context}`
    };

    const result = await streamText({
      model: google("models/gemini-1.5-pro"),
      messages: [systemMessage, ...messages],
    });

    const data = new StreamData();
    data.append({ test: "value" });

    const stream = result.toAIStream({
      onFinal(_) {
        data.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}