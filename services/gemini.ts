import { AnalysisUpdate, ChatMessage, StudentProfile, Language } from "../types.ts";

export async function generateScientificImage(prompt: string): Promise<string | null> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error("Failed to generate image");
  const data = await response.json();
  return data.imageUrl;
}

export async function getChatResponse(messages: ChatMessage[], profile: StudentProfile, language: Language = Language.HEBREW): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, profile, language }),
  });
  if (!response.ok) throw new Error("Failed to get chat response");
  const data = await response.json();
  return data.text;
}

export async function* getChatResponseStream(messages: ChatMessage[], profile: StudentProfile, language: Language = Language.HEBREW): AsyncGenerator<string> {
  const response = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, profile, language }),
  });

  if (!response.ok) throw new Error("Failed to get streaming response");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) yield parsed.text;
        } catch (e) {
          console.error("Error parsing stream chunk", e);
        }
      }
    }
  }
}

export async function analyzeStudentState(history: ChatMessage[], currentProfile: StudentProfile, language: Language = Language.HEBREW): Promise<AnalysisUpdate | null> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, currentProfile, language }),
  });
  if (!response.ok) throw new Error("Failed to analyze student state");
  return response.json();
}
