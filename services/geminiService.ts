
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function suggestDishName(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Suggest one creative and delicious-sounding Italian dish name. Only provide the name, with no extra text or quotation marks.',
    });
    
    const text = response.text.trim();
    if (!text) {
        throw new Error("Received an empty suggestion from the AI.");
    }

    return text;
  } catch (error) {
    console.error("Error fetching dish suggestion from Gemini API:", error);
    throw new Error("Failed to get a dish suggestion. Please try again.");
  }
}
