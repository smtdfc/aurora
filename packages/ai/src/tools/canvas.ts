import {
  ArtiusToolDecaration,
  createTool,
  defineSchema,
  zod
} from 'artius';

import {
  Context
} from '../types/index.js'

export function initCanvasTool(context: Context): Record < any, ArtiusToolDecaration > {
  const changeCanvasMode = createTool(
    "change_canvas_mode",
    "Used to set the mode for canvas",
    defineSchema(zod.object({
      mode: zod.string().describe("Canvas mode: 'text' or 'graphic'")
    })),
    ({ mode }: { mode: string }) => {
      context?.onCanvasModeChange?.(mode);
      context.state.canvas.mode = mode;
      console.log(mode);
    }
  );
  
  const readCanvasContent = createTool(
    "read_canvas_content",
    "Read content on canvas ",
    defineSchema(zod.object({})),
    async () => {
      let content = await context?.onRequestReadCanvas?.();
      return content;
    }
  );
  
  const writeCanvasContent = createTool(
    "write_canvas_content",
    "Wirte content on canvas ",
    defineSchema(zod.object({
      content: zod.string().describe("Canvas content: must be raw text or markdown")
    })),
     ({content}:{content: string})=> {
       context?.onRequestWriteCanvas?.(
         "text",
         content
       );
      return content;
    }
  );
  
  
  return {
    changeCanvasMode,
    readCanvasContent,
    writeCanvasContent
  };
}