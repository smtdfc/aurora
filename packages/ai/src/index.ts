import {
  ArtiusModelWrapper,
  ArtiusChat,
  ArtiusBaseProvider,
  zod,
  defineSchema,
  createTool
} from 'artius';
import { ArtiusGoogleProvider } from 'artius-google-provider';

export * from './types/index.js';
export function createChat < T extends ArtiusBaseProvider > (model: ArtiusModelWrapper < T > ) {
  return new ArtiusChat(
    model,
    {
      
    }
  );
}


export function initModel(apiKey: string) {
  
  let provider = new ArtiusGoogleProvider(
    "gemini-2.0-flash",
    {
      apiKey
    }
  );
  
  
  let model = new ArtiusModelWrapper(provider, {
    generation: {
      systemInstruction: `
        Name: Aurora
        You are an AI learning assistant that helps students understand and solve academic problems across subjects. 
        Use clear, concise explanations, and guide students step-by-step rather than giving direct answers. 
        Encourage critical thinking and adjust your explanations based on the student's level.
        You have access to a canvas tool. Use it when visual explanations (e.g., graphs, simulations, diagrams) can improve understanding. 
        Keep interactions friendly, supportive, and focused on learning.
      `
    }
  });
  return model;
}