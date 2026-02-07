import OpenAI from "openai";
import { configDotenv } from "dotenv";

configDotenv();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// create our tool to get current time in a city
const getCurrentTime = (city: string) => {
    const time = new Date().toLocaleString("en-US",{
        timeZone: 'America/New_York', 
    }) 
    return `The current time in ${city} is ${time}`;
}


const context: OpenAI.ChatCompletionMessageParam[] = [{
        role: "system",
        content: "You are a helpful assistant.",
    },
    {
        role: "user",
        content: "what is current time in new york?",
    }];

async function callAiTool() { 
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
    tools:[
        {
            type: "function",
            function: {
                name: "getCurrentTime",
                description: "Get the current time in a city",
                parameters: {
                    type: "object",
                    properties: {
                        city: {
                            type: "string",
                            description: "The city to get the current time in",
                        },
                    },
                    required: ["city"],
                },
            },
        }
    ],
    tool_choice: "auto",
  });
  const willInvokeTheTool = response.choices[0].finish_reason === "tool_calls";
  const toolCall = response.choices[0].message.tool_calls?.[0];
  
  if(willInvokeTheTool && toolCall?.type === 'function'){
    const toolName = toolCall.function.name;  
    if(toolName === 'getCurrentTime' ){
        const time = getCurrentTime('new york');
        const msg = response.choices[0].message; 
        context.push({
            role: msg.role,
            content: msg.content,
            tool_calls: msg.tool_calls || undefined,
        } as OpenAI.ChatCompletionMessageParam);
        context.push({
            role: "tool",
            content: time,
            tool_call_id: toolCall?.id ?? '',
        });
        console.log(time);
    }
  }
  
  const secondResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });
  console.log(secondResponse.choices[0].message.content);
}
 

callAiTool();
