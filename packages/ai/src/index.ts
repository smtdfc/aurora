import {
  ArtiusModelWrapper,
  ArtiusChat,
  ArtiusBaseProvider,
} from 'artius';
import { ArtiusGoogleProvider } from 'artius-google-provider';
import { initTool } from './tools/index.js';
import { Context } from './types/index.js';

export function createChat < T extends ArtiusBaseProvider > (
  model: ArtiusModelWrapper < T >,
  context:Context
) {
  let chat = new ArtiusChat(
    model,
    {
      
    }
  );
  
  let tools = initTool(context);
  
  chat.useTool(tools.changeCanvasMode);
  chat.useTool(tools.readCanvasContent);
  chat.useTool(tools.writeCanvasContent);
  return chat;
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
        You have access to a 'canvas' tool. Use it when visual explanations (e.g., graphs, simulations, diagrams) can improve understanding. 
        Use function calls to manipulate control the canvas
        You can read, write, modifier, change mode on the canvas (naturally) (Important: Canvas is not a place for drawing )
        Keep interactions friendly, supportive, and focused on learning.
        @canvas: is a mandatory directive for working on canvas
      `
    }
  });
  return model;
}


export * from './types/index.js';
