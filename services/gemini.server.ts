import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { getSystemPrompt } from "../constants.ts";
import { AnalysisUpdate, ChatMessage, StudentProfile, Language } from "../types.ts";

function getAI() {
  let apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  // Remove potential quotes or whitespace
  apiKey = apiKey.trim().replace(/^["'](.+)["']$/, '$1');
  
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

function cleanContentForTextModel(content: string): string {
  return content.replace(/!\[.*?\]\(data:image\/.*?;base64,.*?\)/g, '[הפורקה תמונה מדעית]');
}

export async function generateScientificImage(prompt: string) {
  const ai = getAI();
  
  // Use correct generateContent method for images per skill
  // gemini-2.5-flash-image is the recommended model for general image generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ 
      parts: [{ 
        text: `Create a high-resolution, professional scientific diagram of ${prompt}. 
        Style: Clean textbook illustration.` 
      }] 
    }],
    config: { 
      imageConfig: { aspectRatio: "1:1" } 
    }
  });
  
  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return imagePart?.inlineData?.data ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
}

export async function getChatResponse(messages: ChatMessage[], profile: StudentProfile, language: Language = Language.HEBREW) {
  const ai = getAI();
  
  const cleanedMessages = messages.slice(-15).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: cleanContentForTextModel(m.content) }]
  }));

  const { habits, savedExperiments, concepts, ...lightProfile } = profile;

  // Use ai.models.generateContent directly per skill
  // Using gemini-3-flash-preview as recommended for text tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: cleanedMessages,
    config: {
      systemInstruction: `${getSystemPrompt(language)}\n\n[GLOBAL KNOWLEDGE MODE: ACTIVE]\nפרופיל תלמיד: ${JSON.stringify(lightProfile)}`,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    },
  });

  return response.text || '';
}

export async function* getChatResponseStream(messages: ChatMessage[], profile: StudentProfile, language: Language = Language.HEBREW) {
  const ai = getAI();
  
  const cleanedMessages = messages.slice(-15).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: cleanContentForTextModel(m.content) }]
  }));

  const { habits, savedExperiments, concepts, ...lightProfile } = profile;

  const response = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: cleanedMessages,
    config: {
      systemInstruction: `${getSystemPrompt(language)}\n\n[GLOBAL KNOWLEDGE MODE: ACTIVE]\nפרופיל תלמיד: ${JSON.stringify(lightProfile)}`,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    },
  });

  for await (const chunk of response) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

export async function analyzeStudentState(history: ChatMessage[], currentProfile: StudentProfile, language: Language = Language.HEBREW): Promise<AnalysisUpdate | null> {
  const ai = getAI();
  
  const cleanedHistorySlice = history.slice(-5).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: cleanContentForTextModel(m.content) }]
  }));

  const conceptIds = currentProfile.concepts.map(c => c.id).join(', ');

  // Use ai.models.generateContent for JSON response per skill
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{
      role: 'user',
      parts: [{
        text: `Analyze the student's progress based on this history: ${JSON.stringify(cleanedHistorySlice)}.
    
    CRITICAL: You MUST only update concepts from this list: [${conceptIds}].
    If the user is discussing atoms or bonds, update 'atomic-structure'. 
    If they are discussing mixtures, update 'mixtures-compounds'.
    If they are discussing force, motion, or speed, update 'mechanics-forces'.
    If they are discussing energy, update 'energy-work'.
    If they are discussing circuits or magnets, update 'electricity-magnetism'.
    If they are discussing light, lenses, or mirrors, update 'optics-waves'.
    
    Status hierarchy: 'not_started' -> 'diagnosing' (just starting) -> 'in_progress' (learning) -> 'mastered' (knows it).
    Use 'weak' if they struggle.

    LANGUAGE POLICY: 
    - suggestedLearningStyle must be in ${language === Language.HEBREW ? 'HEBREW' : 'ENGLISH'}.
    - identifiedWeakness must be in ${language === Language.HEBREW ? 'HEBREW' : 'ENGLISH'}.`
      }]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          updatedConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { 
                id: { type: Type.STRING, description: "Must match one of the provided IDs exactly" }, 
                status: { type: Type.STRING, description: "lowercase: not_started, diagnosing, weak, in_progress, mastered" }, 
                identifiedWeakness: { type: Type.STRING } 
              },
              required: ["id", "status"]
            }
          },
          suggestedLearningStyle: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["updatedConcepts"]
      }
    }
  });

  try { 
    const text = (response.text || '').replace(/```json|```/g, '').trim();
    const data = JSON.parse(text);
    if (data.updatedConcepts) {
      data.updatedConcepts = data.updatedConcepts.map((c: any) => ({
        ...c,
        status: c.status?.toLowerCase()
      }));
    }
    return data;
  } catch (e) { 
    console.error("Analysis Parse Error:", e);
    return null; 
  }
}