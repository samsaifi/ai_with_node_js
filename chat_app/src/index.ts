const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
type Context = {
    role: "system" | "user" | "assistant";
    content: string;
}[];
const context:Context = [{
    role: "system", 
    content: "You'r a helpful assistant"
},{
    role:"user",
    content:"Hello, how are you?"
}];
async function chatCompletion() {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages:  context
    });
    const responseMessage = response.choices[0].message;
    context.push({
        role: "assistant",
        content: responseMessage.content
    });
    console.log(`Assistant: ${response.choices[0].message.role} said: ${response.choices[0].message.content}`);
}
async function main() {
    const input = require('prompt-sync')({sigint:true});
    while (true) {
        const userQuery = input() as string;
        if (userQuery.toLowerCase() === "exit") {
            console.log("Exiting the program.");
            break;
        }   
        context.push({
            role: "user",
            content: userQuery
        });
        await chatCompletion();
    }   
}   
main();
