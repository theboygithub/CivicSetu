import express from 'express';
import dotenv from 'dotenv';
import { generateDynamicMockAnalysis } from '../data/mockAnalysis.js';
import { ensureBase64Image, extractJSON } from '../utils/llmHelper.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Re-read .env dynamically so any new API key or model change is picked up without restarting
    dotenv.config({ override: true });

    const { image, description = '', location = '' } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const model = process.env.OPENROUTER_MODEL?.trim() || 'google/gemini-2.5-flash';

    let lastError = null;

    // If an OpenRouter API key is provided, attempt live LLM inference
    if (apiKey) {
      try {
        console.log(`[OpenRouter] Invoking model: "${model}" for problem analysis...`);

        // Convert image to base64 if it's a URL, so vision models don't fail fetching it
        let formattedImage = null;
        if (image) {
          formattedImage = await ensureBase64Image(image);
        }

        const userPrompt = `Citizen Community Report:
Location: ${location || "Unspecified"}
Description: ${description || "Please diagnose based on the attached photo"}

Analyze this community problem, diagnose root cause, categorize it, assess severity, identify the required academic/engineering disciplines needed, and suggest 3-4 potential solution areas.

You MUST respond ONLY with a valid JSON object in this exact schema with NO extra markdown or conversational text:
{
  "detectedProblem": "Clear title of the problem (e.g. Broken public handpump)",
  "category": "Domain category (e.g. Water Management, Civil Infrastructure, Renewable Energy, Waste Management)",
  "severity": "High" | "Medium" | "Low" | "Critical",
  "requiredExpertise": ["Field 1", "Field 2", "Field 3", "Field 4"],
  "possibleSolutions": [
    "Solution point 1",
    "Solution point 2",
    "Solution point 3",
    "Solution point 4"
  ]
}`;

        const contentArray = [{ type: "text", text: userPrompt }];

        if (formattedImage) {
          contentArray.push({
            type: "image_url",
            image_url: {
              url: formattedImage
            }
          });
        }

        const messages = [
          {
            role: "user",
            content: contentArray
          }
        ];

        // Set max_tokens: 1200 to prevent 402 credit limit errors
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "CivicSetu Problem Solver"
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.2,
            max_tokens: 1200
          })
        });

        if (openRouterResponse.ok) {
          const completion = await openRouterResponse.json();
          const rawContent = completion.choices?.[0]?.message?.content || "";
          console.log("[OpenRouter] Problem Diagnosis Received!");

          const parsed = extractJSON(rawContent);

          if (parsed && parsed.detectedProblem) {
            console.log("[OpenRouter] Successfully parsed diagnosis JSON from LLM!");
            return res.json({
              success: true,
              source: "openrouter",
              model: model,
              data: {
                detectedProblem: parsed.detectedProblem,
                category: parsed.category || "Civil & Community Infrastructure",
                severity: parsed.severity || "High",
                requiredExpertise: Array.isArray(parsed.requiredExpertise) && parsed.requiredExpertise.length > 0 
                  ? parsed.requiredExpertise 
                  : ["Civil Engineering", "Mechanical Engineering"],
                possibleSolutions: Array.isArray(parsed.possibleSolutions) && parsed.possibleSolutions.length > 0
                  ? parsed.possibleSolutions
                  : ["Site investigation and repair"]
              }
            });
          } else {
            lastError = "Model responded but JSON output could not be parsed: " + rawContent.slice(0, 100);
            console.warn(`[OpenRouter Warning] ${lastError}`);
          }
        } else {
          const errStatus = openRouterResponse.status;
          const errText = await openRouterResponse.text();
          lastError = `OpenRouter HTTP ${errStatus}: ${errText}`;
          console.warn(`[OpenRouter Error] ${lastError}`);
        }
      } catch (llmError) {
        lastError = `Network/Fetch Error: ${llmError.message}`;
        console.warn(`[OpenRouter Exception] ${lastError}`);
      }
    } else {
      console.log("[Analysis] OPENROUTER_API_KEY is not set or empty in backend/.env.");
    }

    // Default or Fallback: Intelligent mock analysis
    console.log("[Analysis] Serving mock analysis engine.");
    const mockResult = generateDynamicMockAnalysis({
      description,
      location,
      imagePresent: Boolean(image)
    });

    return res.json({
      success: true,
      source: apiKey ? "openrouter_error_fallback" : "mock",
      model: apiKey ? `${model} (fallback)` : "Mock Analysis Engine",
      apiError: lastError || (!apiKey ? "OPENROUTER_API_KEY is empty in backend/.env. Please add key and save file." : null),
      data: mockResult
    });

  } catch (error) {
    console.error("[Analyze Route Error]", error);
    return res.status(500).json({
      success: false,
      error: "Failed to analyze problem report",
      details: error.message
    });
  }
});

export default router;
