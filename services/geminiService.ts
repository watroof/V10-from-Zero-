
import { GoogleGenAI, Type } from "@google/genai";
import { Script, Scene } from "../types";

// Service to generate cinematic video scripts using Gemini API
export const generateScript = async (
  formData: {
    mode: string;
    personName: string;
    dob?: string;
    externalCharacter?: string;
    visualStyle: string;
    tone: string;
    temperature: number;
    customSystemPrompt: string;
    apiKey: string;
  }
): Promise<Partial<Script>> => {
  const ai = new GoogleGenAI({ apiKey: formData.apiKey });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      master_style_prompt: { 
        type: Type.STRING, 
        description: "The core stylistic DNA for the whole video. Include art style, lens, lighting, and palette." 
      },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            scene_number: { type: Type.INTEGER },
            visual_description: { type: Type.STRING },
            camera_motion: { type: Type.STRING },
            start_frame_prompt: { type: Type.STRING, description: "Full prompt for the starting image, incorporating the master style." },
            end_frame_prompt: { type: Type.STRING, description: "Full prompt for the ending image, incorporating the master style." },
            dialogue_or_narration: { type: Type.STRING },
            mood_and_lighting: { type: Type.STRING }
          },
          required: [
            "scene_number",
            "visual_description",
            "camera_motion",
            "start_frame_prompt",
            "end_frame_prompt",
            "dialogue_or_narration",
            "mood_and_lighting"
          ]
        }
      }
    },
    required: ["title", "master_style_prompt", "scenes"]
  };

  const prompt = `
    GENERATE SCRIPT FOLLOWING THE CONTINUITY-LOCKED INSTRUCTION:
    Mode: ${formData.mode}
    Subject: ${formData.personName}
    DOB: ${formData.dob || 'N/A'}
    External Character: ${formData.externalCharacter || 'None'}
    Visual Style: ${formData.visualStyle}
    Tone: ${formData.tone}
    
    CRITICAL: Exactly 3 scenes. Each 5-8 seconds. 
    Ensure Scene 1 End Frame Prompt content matches Scene 2 Start Frame Prompt content exactly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: formData.customSystemPrompt,
        temperature: formData.temperature,
        responseMimeType: "application/json",
        responseSchema
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      title: result.title,
      scenes: result.scenes,
      master_style_prompt: result.master_style_prompt,
      mode: formData.mode,
      person_name: formData.personName,
      visual_style: formData.visualStyle,
      tone: formData.tone,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("PEAK Script Failure:", error);
    throw error;
  }
};
