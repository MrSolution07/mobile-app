/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = "AIzaSyAf-szjGCqLylbNyioybY-BVqwMw8nR0aA";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
   async function runChat(prompt) {
    // Convert the prompt to lowercase to handle case-insensitivity
    const trimmedPrompt = prompt.trim().toLowerCase();
    if (
      trimmedPrompt === "what is your name ?" ||
      trimmedPrompt === "what's your name ?" ||
      trimmedPrompt === "who are you ?" ||
      trimmedPrompt === "what is your name?" ||
      trimmedPrompt === "what's your name?" ||
      trimmedPrompt === "who are you?" ||
      trimmedPrompt === "whats your name?" || // Missing apostrophe
      trimmedPrompt === "whats your name ?" ||
      trimmedPrompt === "what is ur name?" || 
      trimmedPrompt === "what is ur name ?" ||
      trimmedPrompt === "whats ur name?" ||
      trimmedPrompt === "whats ur name ?" ||
      trimmedPrompt === "who r u?" || 
      trimmedPrompt === "who r u ?" ||
      trimmedPrompt === "who are u?" || // "u" instead of "you"
      trimmedPrompt === "who are u ?" ||
      trimmedPrompt === "who r u" || // Without the question mark
      trimmedPrompt === "who are u" ||
      trimmedPrompt === "what is your name" || // Without the question mark
      trimmedPrompt === "what's your name" ||
      trimmedPrompt === "who are you" ||
      trimmedPrompt === "whats your name" ||
      trimmedPrompt === "what is ur name" ||
      trimmedPrompt === "whats ur name"
    )
    
    {
      return "My name is MetaWay AI.";
    }
  
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });
  
    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    console.log(result.response.text());
    return response.text();
  }
  
  export default runChat;