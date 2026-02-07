import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: " tell me a joke in hindi" }],
    });
    console.log(response.choices[0].message.content); 
}
main();
