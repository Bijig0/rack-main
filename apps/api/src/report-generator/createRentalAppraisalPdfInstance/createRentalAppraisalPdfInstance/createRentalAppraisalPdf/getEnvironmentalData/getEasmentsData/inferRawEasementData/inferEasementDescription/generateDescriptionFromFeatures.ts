import { GoogleGenAI } from "@google/genai";
import { GOOGLE_GEMINI_API_KEY } from "../../../../../../../../shared/config";

const apiKey = GOOGLE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

async function main() {
  console.log("Test");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();

// const generateDescriptionFromFeatures = () => {

// }
