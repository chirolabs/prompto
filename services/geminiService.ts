import { GoogleGenAI } from "@google/genai";
import { OptimizationMode } from "../types";
import { SYSTEM_INSTRUCTIONS, getModeInstruction } from "../constants";

const apiKey = process.env.API_KEY;

export const optimizePrompt = async (
  input: string,
  mode: OptimizationMode
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prompt Engineering: Combine the specific mode instruction with the user's raw input
  const modeDirective = getModeInstruction(mode);
  
  const fullPrompt = `
    ${modeDirective}
    
    [USER RAW INPUT START]
    ${input}
    [USER RAW INPUT END]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.7, // Balanced for creativity vs adherence
      }
    });

    if (!response.text) {
      throw new Error("No response generated.");
    }

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};