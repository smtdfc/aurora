import { ArtiusModelWrapper, ArtiusChat, zod, defineSchema, createTool } from 'artius';
import { ArtiusGoogleProvider } from 'artius-google-provider';

let provider = new ArtiusGoogleProvider(
  "gemini-2.0-flash",
  {
    apiKey: process.env.GOOGLE_API_KEY
  }
);

const tool = createTool(
  "add",
  "Cộng hai số",
  defineSchema(zod.object({
    message: zod.string()
  })),
  (_) => console.log(1)
)

let model = new ArtiusModelWrapper(provider, {});
model.useTool(tool);

let chat = new ArtiusChat(model, {})

chat.send({
    prompt: "Xin chào ",
    /* options: {
       schemaGenertion: true,
       schema: defineSchema(zod.object({
         message: zod.string()
       }))
     }*/
  })
  .then((response) => {
    console.log(response);
  })