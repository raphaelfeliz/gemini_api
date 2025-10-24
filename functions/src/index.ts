/*
# FILE PATH:
C:\dev\gemini_api\gemini_tests\functions\src\index.ts
# PURPOSE
Creates a secure, reusable, and cross-origin enabled API endpoint
to access the Gemini API, with optional model selection and JSON response handling.
# SUMMARY:
This Cloud Function (v2) waits for an HTTPS request.
1. It validates the request is from an allowed origin (CORS).
2. It validates the request has a secret "Bearer" token (WIDGET_API_KEY).
3. It reads the user's prompt and optional model from the JSON POST body.
4. It calls the Gemini API using a secure secret (API_KEY) and the specified model.
5. It attempts to parse the Gemini response as JSON.
6. If successful, it sends the parsed object back with Content-Type: application/json.
7. If parsing fails, it sends the original plain text response.
# IMPORTS:
- onRequest (firebase-functions/v2/https): The trigger to create an HTTP function.
- GoogleGenAI (@google/genai): The Gemini API client.
- cors (cors): Middleware to handle cross-origin requests.
# EXPORTS:
- getGeminiResponse: The main Cloud Function endpoint.
# CHANGE LOG:
- 2025-10-24: Created v1 (Hello World)
- 2025-10-24: Upgraded to v2 (CORS, Security Key, POST body)
- 2025-10-24: Fixed 'cors' import syntax from 'import * as' to 'import'
- 2025-10-24: Added WIDGET_API_KEY to secrets array for deployment
- 2025-10-24: Added optional 'model' parameter to request body (defaults to gemini-2.5-flash)
- 2025-10-24: Added JSON parsing logic for Gemini response (fallback to text)
- 2025-10-24: Added undefined check for result.text before parsing
*/

import {onRequest} from "firebase-functions/v2/https";
import {GoogleGenAI} from "@google/genai";
import cors from "cors";

// Initialize cors handler
const corsHandler = cors({origin: true});

// Define the function, ensuring it has access to both secrets
export const getGeminiResponse = onRequest({
  secrets: ["API_KEY", "WIDGET_API_KEY"], // Load both secrets
  timeoutSeconds: 30,
}, async (request, response) => {
  // 1. Run the CORS handler to allow cross-origin requests
  corsHandler(request, response, async () => {
    // 2. Check for our private widget "password" (Bearer Token)
    const authHeader = request.headers.authorization;
    // Read the expected key securely from the environment
    const expectedApiKey = process.env.WIDGET_API_KEY;

    if (!expectedApiKey) {
      console.error("WIDGET_API_KEY is not set in the environment.");
      response.status(500).send("API security not configured.");
      return;
    }

    if (!authHeader || authHeader !== `Bearer ${expectedApiKey}`) {
      console.warn("Unauthorized access attempt.");
      response.status(401).send("Unauthorized");
      return;
    }

    // 3. Read the Gemini API key from the environment
    const geminiApiKey = process.env.API_KEY;
    if (!geminiApiKey) {
      console.error("Gemini API_KEY is not set.");
      response.status(500).send("API Key not configured.");
      return;
    }

    // 4. Read the user's prompt and optional model from the POST body
    // Expected JSON: { "prompt": "Hello", "model": "gemini-1.5-pro" (optional) }
    const userPrompt = request.body.prompt;
    if (!userPrompt) {
      response.status(400).send("No prompt provided in body.");
      return;
    }
    // Read the optional model name, default to flash
    const requestedModel = request.body.model || "gemini-2.5-flash";


    // 5. Call the Gemini API
    try {
      const ai = new GoogleGenAI({apiKey: geminiApiKey});
      const result = await ai.models.generateContent({
        model: requestedModel, // Use the variable model name
        contents: userPrompt, // Use the prompt from the request
      });

      // --- MODIFIED ---
      // Safely get the text, providing an empty string if undefined
      const aiResponseText = result.text ?? "";
      // --- END MODIFIED ---

      // Try to parse as JSON
      try {
        const parsedJson = JSON.parse(aiResponseText);
        // Success! Send it as JSON with the correct Content-Type
        response.json(parsedJson);
      } catch (parseError) {
        // Parsing failed, it's probably just plain text. Send as is.
        response.send(aiResponseText);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      response.status(500).send("Gemini API call failed.");
    }
  });
});
