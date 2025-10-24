Here is the updated documentation, with the "How To Use It" section modified to reflect the new, robust JSON parsing logic.

***

## 📄 Gemini API Gateway Documentation

This document provides specifications and instructions for the secure, reusable Firebase Cloud Function (`getGeminiResponse`).

***

## Project Specs:

- **Firebase Project:** `gen-lang-client-0545699517`
- **Function Name:** `getGeminiResponse`
- **Live URL:** `https://getgeminiresponse-qyordqv5ta-uc.a.run.app`
- **Runtime:** Node.js 22 (2nd Gen)
- **Security:** Requires `Authorization: Bearer WIDGET_API_KEY` header.
- **Gemini Key Source:** Google Secret Manager (`API_KEY`).
- **Widget Key Source:** Google Secret Manager (`WIDGET_API_KEY`).
- **Default Gemini Model:** `gemini-2.5-flash`

***

## How To Use It:

- **Method:** Send an HTTP **POST** request to the Live URL.
- **Required Header 1:** `Content-Type: application/json`
- **Required Header 2 (Security):** `Authorization: Bearer Ge41424344#`
- **Required Body:** A JSON object with the user's message in the `prompt` key.
- **Optional Body Parameter:** `model` (string) - Specify a Gemini model name (e.g., `"gemini-2.5-pro"`). If omitted, the default (`gemini-2.5-flash`) is used.
- **Example Body (Default Model):** `{"prompt": "What is the capital of Brazil?"}`
- **Example Body (Specific Model):** `{"prompt": "Generate a slogan.", "model": "gemini-2.5-pro"}`
- **Success Response (Dynamic):** HTTP `200 OK`. The `Content-Type` depends on the AI's output:
    * **JSON Response:** The function first **cleans the raw AI text** to remove any Markdown fences (e.g., ` ```json ... ``` `). It then attempts to parse this *cleaned text*. If successful, the response is a valid JSON object with **`Content-Type: application/json`**.
    * **Plain Text/Fallback:** If parsing the cleaned text fails (because the response was a normal chat reply or malformed JSON), the response is the *original* text string with a non-JSON header (e.g., `text/html`).
- **Failure Response:** HTTP `401 Unauthorized` (wrong key), `400 Bad Request` (missing `prompt`), or `500 Internal Server Error` (invalid model name or Gemini API issue).

***

## How To Update It:

- **Edit File:** Modify `functions/src/index.ts` to change logic (e.g., default model, system instructions).
- **Compile:** Navigate to `functions/` and run `npm run build`.
- **Redeploy:** Navigate to the project root (`gemini_tests`) and run `firebase deploy --only functions`.
- **Note:** Redeploying grants the function access to both secret keys (`API_KEY`, `WIDGET_API_KEY`) defined in the `secrets` array.

***

## Security Notes:

- **Secret Keys:** Both the Gemini API key and the Widget API key are stored in **Google Secret Manager** and are **never exposed** in the client-side code or the server logs.
- **Local Testing:** Local testing requires both keys in a temporary `.env` file for the emulator (e.g., `functions/.env`). **This file MUST be deleted before deployment.**
- **Access Control:** The function uses `cors({origin: true})` to allow all origins, which should be **restricted to specific domains** for production environments (e.g., `cors({origin: ['https://yourdomain.com']})`).