import { OpenAI } from "openai";
import dotenv from "dotenv";
import { writeFileSync } from "fs";

dotenv.config();
const model = "dall-e-3";
const modeltext = "tts-1";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const response = await openai.images.generate({
        model: model,
        prompt: "a beautiful wallpaper for web developer",
        n: 1,
        quality: "standard",
        style: "vivid",
        
        size: "1024x1024",
    });
    const image = response.data?.[0]?.url;
    if (!image) {
        throw new Error("No image URL found");
    }
    const imageResponse = await fetch(image);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    writeFileSync("image.png", imageBuffer);
    console.log(response);
}

async function generateImageWithPrompt(prompt: string) {
    const response = await openai.audio.speech.create({
        input: prompt, 
        model: "gpt-4o-mini-tts",        // Recommended TTS model
        response_format: "mp3",
        voice: "nova",                   // Most natural available
        speed: 0.85                      // Slightly slower = more human
        
    });
    console.log(response);
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync("audio.mp3", buffer);
    console.log("Audio generated successfully");
}


generateImageWithPrompt("ho hoeeee ... kya banegaaa varsha aapka. aapka kuch nhi ho sakta.. 2 packet chips or char chai bhej rha hu main tumhare  enjoy kro. ");
// main();
