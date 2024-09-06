import { google } from "@ai-sdk/google";
import { streamText, StreamData } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Add a system message to set the assistant's role and emphasize short responses
        const systemMessage = {
            role: "system",
            content: "You are a concise assistant for an online learning platform. Please keep responses short and informative."
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
