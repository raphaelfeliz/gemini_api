Phase 1: Project Setup & Configuration (Detailed with Log Points)
This phase ensures the project folder is created correctly, Firebase is initialized properly, configurations are fixed upfront, essential code packages are installed, and security keys are securely stored before writing any function logic.

1.1 Directory Setup
Goal: Create and confirm the correct folder structure.
1.1.1 Create the main directory C:\dev\gemini_api.
1.1.2 Navigate into C:\dev\gemini_api.
1.1.3 Create the sub-directory gemini_tests.
1.1.4 Navigate into C:\dev\gemini_api\gemini_tests.
1.1.5 Check: Run pwd (or cd) to confirm you are in the correct gemini_tests directory. ✅ (Log Required)

1.2 Firebase Initialization
Goal: Initialize a clean Firebase Functions project using TypeScript.
1.2.1 Run the command firebase init functions.
1.2.2 Answer Prompt: Select existing project (gen-lang-client-0545699517).
1.2.3 Answer Prompt: Choose language TypeScript.
1.2.4 Answer Prompt: Use ESLint? Yes.
1.2.5 Answer Prompt: Install dependencies now? Yes.
1.2.6 Check: Observe the terminal output. Confirm the npm install step completes successfully. ✅ (Log Required - Full Output)
1.2.7 Check: Run ls (or dir) and confirm the functions sub-directory was created. ✅ (Log Required)

1.3 ESLint Configuration Fix
Goal: Proactively fix the known ESLint path issue.
1.3.1 Open the file functions/.eslintrc.js in your editor.
1.3.2 Add the line tsconfigRootDir: __dirname, inside the parserOptions block.
1.3.3 Check: Verify your code editor shows no parsing errors for this file. ✅ (No Log needed, visual check)
1.3.4 Save the .eslintrc.js file. (No Log needed)

1.4 Install Core Packages
Goal: Add the Gemini SDK and CORS middleware.
1.4.1 Navigate into the functions directory.
1.4.2 Run the command npm install @google/genai cors.
1.4.3 Check: Observe the terminal output. Confirm the installation completes successfully. ✅ (Log Required - Full Output)

1.5 Secret Configuration
Goal: Securely store both API keys needed for the function.
1.5.1 Navigate back to the project root directory (gemini_tests).
1.5.2 Run the command firebase functions:secrets:set API_KEY.
1.5.3 When prompted, paste your Gemini API Key (AIzaSy...).
1.5.4 Check: Confirm the command output shows + Created a new secret version... for API_KEY. ✅ (Log Required - Full Output)
1.5.5 Run the command firebase functions:secrets:set WIDGET_API_KEY.
1.5.6 When prompted, enter your chosen Widget API Key (Ge41424344#).
1.5.7 Check: Confirm the command output shows + Created a new secret version... for WIDGET_API_KEY. ✅ (Log Required - Full Output)
1.5.8 Optional Check: Run firebase functions:secrets:get API_KEY and firebase functions:secrets:get WIDGET_API_KEY. ✅ (Log Required - Full Output if run)

Phase 2: Develop & Build Function 🛠️
This phase focuses on writing the actual logic for the Cloud Function, fixing common style issues, and compiling the code into a format Firebase can run.

2.1 Write Function Code
Goal: Create the core logic inside the functions/src/index.ts file.
Actions:
Define an HTTPS function trigger (onRequest).
Integrate CORS: Import the cors package correctly (import cors from "cors";) and wrap the main logic inside the corsHandler to allow web browsers to call the function.
Link Secrets: Update the function definition to request access to both secret keys (API_KEY and WIDGET_API_KEY) using the secrets array. This makes them available as process.env variables.
Implement Security: Add code to check the incoming Authorization header against the process.env.WIDGET_API_KEY.
Parse Input: Read the prompt and optional model from the request's JSON body.
Call Gemini: Use the process.env.API_KEY to initialize the Gemini client and call the generateContent method with the user's prompt and specified model.
Return Response: Send the text result from Gemini back to the caller.

2.2 Run Lint Fix
Goal: Automatically fix common code style errors before they cause problems.
Action: Navigate into the functions directory and run the command npm run lint -- --fix. This uses ESLint to clean up formatting issues like spacing, quotes, and line endings based on the project's rules.

2.3 Compile TypeScript
Goal: Convert the human-readable TypeScript code (.ts) into JavaScript (.js) that the Firebase server can execute.
Action: While still in the functions directory, run the command npm run build. This executes the TypeScript compiler (tsc).

2.4 Verify Build Output
Goal: Confirm that the compilation was successful and created the necessary JavaScript file.
Action: Check the contents of the functions/lib directory (e.g., using ls lib).
Check: Ensure the compiled index.js file exists and has a recent timestamp, indicating the build worked correctly.


Phase 3: Local Testing (Emulator) 🧪
This phase simulates the live Firebase environment on your local machine, allowing you to test the function's logic, including security checks and API calls, without deploying it.

3.1 Create Local .env File
Goal: Provide the necessary API keys (both Gemini and Widget) to the local emulator.
Action: Create a simple .env file inside the functions directory. Add lines for API_KEY (with the Gemini key) and WIDGET_API_KEY (with your widget password). This file is only for the emulator and must not be deployed.

3.2 Start Emulator
Goal: Launch the Firebase Functions emulator.
Action: Navigate to the project root directory (gemini_tests) and run the command firebase emulators:start --only functions.
Check: Verify the emulator starts successfully and logs that it loaded the environment variables from the .env file.

3.3 Test Locally
Goal: Send test requests to the function running on the local emulator URL to confirm all logic works.
Action: Open a new terminal window (keep the emulator running). Use curl (or a tool like Postman) to send POST requests to the local URL provided by the emulator.
Checks:
Test with the correct Authorization: Bearer <widget_key> header and a valid JSON body ({"prompt": "..."}). Verify a 200 OK response with AI text.
Test without or with an incorrect Authorization header. Verify a 401 Unauthorized error.
Test with an invalid JSON body (e.g., missing prompt). Verify a 400 Bad Request error.
Phase 4: Deployment & Live Testing 🚀☁️
This phase takes the function from your local machine to the live Firebase cloud environment and confirms it works correctly with real requests.

4.1 Remove Local .env File
Goal: Prevent the deployment conflict where local environment variables overlap with secure secrets.
Action: Navigate into the functions directory and delete or rename the .env file. This is crucial because the deployed function will get its keys securely from Google Secret Manager.

4.2 Deploy Function
Goal: Upload and activate the function code on Firebase servers.
Action: Navigate back to the project root directory (gemini_tests) and run the command firebase deploy --only functions.
Check: Verify the deployment completes successfully, provides a live Function URL, and grants access to the secrets. Answer "No" if prompted about deleting other functions.

4.3 Test Live URL
Goal: Confirm the deployed function works correctly, including security checks and optional parameters.
Action: Use curl (or a similar tool) to send POST requests to the live Function URL.
Checks:
Test with the correct Authorization header and a simple prompt (using the default model). Verify a 200 OK response with AI text.
Test with the correct Authorization header and a prompt plus a valid model parameter. Verify a 200 OK response.
Test with the correct Authorization header and an invalid model parameter. Verify a 500 Internal Server Error and the "Gemini API call failed" message.
Test without or with an incorrect Authorization header. Verify a 401 Unauthorized error.

