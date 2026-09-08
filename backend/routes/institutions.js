import express from 'express';
import dotenv from 'dotenv';
import { loadAllUniversities } from '../data/loadUniversities.js';
import { ensureBase64Image, extractJSON } from '../utils/llmHelper.js';

const router = express.Router();

// Load all 105 verified universities from universities.json
const allUniversities = loadAllUniversities();

// Helper to find an institution by ID or name slug
function findInstitution(id) {
  if (!id) return null;
  const cleanId = id.toLowerCase().trim();
  return allUniversities.find(u => 
    u.id === cleanId || 
    u.id.includes(cleanId) || 
    cleanId.includes(u.id) ||
    u.name.toLowerCase().includes(cleanId.replace(/-/g, ' '))
  );
}

// 1. GET all institutions (from universities.json)
router.get('/', (req, res) => {
  res.json({
    success: true,
    total: allUniversities.length,
    data: allUniversities
  });
});

// Helper for high-performance algorithmic matching against universities.json
function matchFromUniversitiesDataset({ requiredExpertise = [], category = "", location = "" }) {
  const userLoc = (location || "").toLowerCase();
  const searchTerms = [
    ...requiredExpertise.map(e => e.toLowerCase()),
    category.toLowerCase()
  ];

  const scored = allUniversities.map(inst => {
    let score = 70;
    const whyReasons = [];

    // 1. Check department alignment
    const matchedDepts = inst.departments.filter(dept =>
      searchTerms.some(term => dept.toLowerCase().includes(term) || term.includes(dept.toLowerCase()))
    );
    if (matchedDepts.length > 0) {
      score += Math.min(matchedDepts.length * 6, 16);
      whyReasons.push(`Relevant ${matchedDepts.slice(0, 2).join(' & ')} department`);
    }

    // 2. Check expertise alignment
    const matchedSkills = inst.expertise.filter(skill =>
      searchTerms.some(term => skill.toLowerCase().includes(term) || term.includes(skill.toLowerCase()))
    );
    if (matchedSkills.length > 0) {
      score += Math.min(matchedSkills.length * 4, 12);
      whyReasons.push(`Demonstrated expertise in ${matchedSkills.slice(0, 2).join(', ')}`);
    }

    // 3. Proximity bonus (State or City match)
    const instState = (inst.state || "").toLowerCase();
    const instCity = (inst.location || "").toLowerCase().split(',')[0];
    if (userLoc && instState && userLoc.includes(instState)) {
      score += 10;
      whyReasons.push(`High geographic proximity in ${inst.state} for rapid on-site deployment`);
    } else if (userLoc && instCity && userLoc.includes(instCity)) {
      score += 14;
      whyReasons.push(`Direct city-level proximity in ${inst.location.split(',')[0]} for immediate field response`);
    }

    // 4. Research lab bonus
    if (inst.activeLabs && inst.activeLabs.length > 0) {
      score += 3;
      whyReasons.push(`Active campus laboratories including ${inst.activeLabs[0]}`);
    }

    if (whyReasons.length === 0) {
      whyReasons.push("Leading engineering faculty with strong technical and prototyping infrastructure");
    }

    const matchPercentage = Math.min(Math.max(score, 72), 97);

    return {
      id: inst.id,
      name: inst.name,
      shortName: inst.shortName,
      location: inst.location,
      state: inst.state,
      nirfRank: inst.nirfRank,
      type: inst.type,
      matchPercentage,
      whyMatch: whyReasons,
      departments: inst.departments,
      expertise: inst.expertise,
      researchAreas: inst.researchAreas,
      activeLabs: inst.activeLabs,
      portalUrl: inst.portalUrl
    };
  });

  // Sort descending by match percentage
  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return scored;
}

// 2. POST /api/institutions/match - Search universities.json with live LLM evaluation
router.post('/match', async (req, res) => {
  try {
    dotenv.config({ override: true });

    const {
      image,
      problemTitle = "Reported Civic Problem",
      category = "",
      severity = "High",
      requiredExpertise = [],
      location = "",
      description = ""
    } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const model = process.env.OPENROUTER_MODEL?.trim() || 'google/gemini-2.5-flash';

    // Step A: Find top candidates from universities.json based on proximity and domain
    const candidatePool = matchFromUniversitiesDataset({
      requiredExpertise,
      category,
      location
    }).slice(0, 8); // Top 8 relevant candidates from universities.json

    // If OpenRouter key is available, let Gemini rank and write custom rationale for these real universities
    if (apiKey && candidatePool.length > 0) {
      try {
        console.log(`[OpenRouter Match] Evaluating ${candidatePool.length} universities from universities.json for "${problemTitle}"...`);

        let formattedImage = null;
        if (image) {
          formattedImage = await ensureBase64Image(image);
        }

        const promptText = `You are an expert university matching evaluator for civic infrastructure and community problems.

A citizen reported a real-world community problem:
- Title: "${problemTitle}"
- Category: "${category}"
- Severity: "${severity}"
- Location: "${location}"
- Description: "${description}"
- Required Disciplines: ${requiredExpertise.join(", ")}

Here are the top candidate universities selected from our verified Indian universities database:
${JSON.stringify(candidatePool.map(c => ({
  id: c.id,
  name: c.name,
  location: c.location,
  departments: c.departments,
  expertise: c.expertise,
  activeLabs: c.activeLabs
})), null, 2)}

Task:
Evaluate these candidates against the problem (and attached image). Rank the top 4 to 6 best suited to solve it.
For each, provide:
- A realistic matchPercentage (75% to 97%)
- 2 to 3 concise bullet points for "whyMatch" explaining their department relevance, research fit, and geographic proximity to ${location}.

Respond ONLY with a valid JSON array of objects:
[
  {
    "id": "matching-institution-id",
    "matchPercentage": 95,
    "whyMatch": [
      "Specific reason 1",
      "Specific reason 2",
      "Specific reason 3"
    ]
  }
]`;

        const contentArray = [{ type: "text", text: promptText }];
        if (formattedImage) {
          contentArray.push({
            type: "image_url",
            image_url: { url: formattedImage }
          });
        }

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
            messages: [{ role: "user", content: contentArray }],
            temperature: 0.2,
            max_tokens: 1200
          })
        });

        if (openRouterResponse.ok) {
          const completion = await openRouterResponse.json();
          const rawContent = completion.choices?.[0]?.message?.content || "";
          const rankedItems = extractJSON(rawContent);

          if (Array.isArray(rankedItems) && rankedItems.length > 0) {
            console.log(`[OpenRouter Match] Successfully ranked ${rankedItems.length} universities from universities.json!`);

            const merged = rankedItems.map(item => {
              const fullInst = candidatePool.find(c => c.id === item.id) || findInstitution(item.id);
              if (!fullInst) return null;
              return {
                ...fullInst,
                matchPercentage: typeof item.matchPercentage === 'number' ? item.matchPercentage : fullInst.matchPercentage,
                whyMatch: Array.isArray(item.whyMatch) && item.whyMatch.length > 0 ? item.whyMatch : fullInst.whyMatch
              };
            }).filter(Boolean);

            merged.sort((a, b) => b.matchPercentage - a.matchPercentage);

            return res.json({
              success: true,
              source: "universities_json_with_llm_ranking",
              model: model,
              count: merged.length,
              data: merged
            });
          }
        }
      } catch (err) {
        console.warn(`[OpenRouter Match Error] ${err.message}. Using algorithmic ranking from universities.json.`);
      }
    }

    // Algorithmic ranking from universities.json
    const topResults = candidatePool.slice(0, 6);
    return res.json({
      success: true,
      source: "universities_json_algorithmic",
      count: topResults.length,
      data: topResults
    });

  } catch (err) {
    console.error("[Institutions Match Error]", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET specific institution by ID (basic profile)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const institution = findInstitution(id);

  if (!institution) {
    return res.status(404).json({
      success: false,
      error: "Institution not found in universities.json"
    });
  }

  res.json({
    success: true,
    data: {
      ...institution,
      matchBreakdown: {
        domainRelevance: 95,
        departmentFit: 92,
        researchInfrastructure: 94,
        geographicProximity: 96
      }
    }
  });
});

// 4. POST /api/institutions/:id - Live LLM-Generated Action Plan for University from universities.json
router.post('/:id', async (req, res) => {
  try {
    dotenv.config({ override: true });

    const { id } = req.params;
    if (id === 'match') {
      return res.status(400).json({ success: false, error: "Invalid institution ID" });
    }

    const {
      problemTitle = "Civic Problem",
      category = "Community Infrastructure",
      severity = "High",
      requiredExpertise = [],
      location = "",
      description = "",
      image = null
    } = req.body;

    const institution = findInstitution(id);
    if (!institution) {
      return res.status(404).json({ success: false, error: `Institution "${id}" not found in universities.json` });
    }

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const model = process.env.OPENROUTER_MODEL?.trim() || 'google/gemini-2.5-flash';

    let liveDetails = null;

    if (apiKey) {
      try {
        console.log(`[OpenRouter Details] Generating LIVE Action Plan for ${institution.name}...`);

        let formattedImage = null;
        if (image) {
          formattedImage = await ensureBase64Image(image);
        }

        const promptText = `You are the Dean of R&D and Academic Innovation for ${institution.name} (${institution.location}).
A citizen has reported this real-world community problem:
- Title: "${problemTitle}"
- Category: "${category}"
- Severity: "${severity}"
- Location: "${location}"
- Description: "${description}"
- Required Disciplines: ${requiredExpertise.join(", ")}

University Profile:
- Relevant Departments: ${(institution.departments || []).join(", ")}
- Technical Expertise: ${(institution.expertise || []).join(", ")}
- Active Research & Labs: ${(institution.activeLabs || []).join("; ") || "Departmental Laboratories"}

Task:
Generate a specialized, actionable university collaboration proposal explaining how ${institution.name} will solve this problem using its departments and laboratories.

Respond ONLY with a valid JSON object in this exact schema with NO extra markdown:
{
  "facultyRecommendation": "Short 1-2 sentence statement on why your institution is best positioned to lead this intervention.",
  "estimatedResolutionTime": "e.g. 2-3 weeks",
  "matchBreakdown": {
    "domainRelevance": 95,
    "departmentFit": 93,
    "researchInfrastructure": 94,
    "geographicProximity": 96
  },
  "actionPlan": [
    {
      "phase": "Phase 1: Field Diagnosis & Inspection",
      "action": "What specific team/students will visit the site and what tests will be run.",
      "department": "Specific department leading this"
    },
    {
      "phase": "Phase 2: Laboratory Prototyping & Repair",
      "action": "How the university lab will fabricate, repair, or test replacement hardware.",
      "department": "Specific laboratory leading this"
    },
    {
      "phase": "Phase 3: Community Deployment & Handover",
      "action": "Final installation, sensor monitoring setup, and local citizen training.",
      "department": "RuTAG or Extension Cell"
    }
  ]
}`;

        const contentArray = [{ type: "text", text: promptText }];
        if (formattedImage) {
          contentArray.push({
            type: "image_url",
            image_url: { url: formattedImage }
          });
        }

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
            messages: [{ role: "user", content: contentArray }],
            temperature: 0.2,
            max_tokens: 1200
          })
        });

        if (openRouterResponse.ok) {
          const completion = await openRouterResponse.json();
          const rawContent = completion.choices?.[0]?.message?.content || "";
          liveDetails = extractJSON(rawContent);
          console.log("[OpenRouter Details] Action Plan generated successfully!");
        }
      } catch (err) {
        console.warn(`[OpenRouter Details Error] ${err.message}`);
      }
    }

    // Default action plan if LLM call fails
    const finalActionPlan = liveDetails?.actionPlan || [
      {
        phase: "Phase 1: Field Assessment & Failure Analysis",
        action: `Deploy student researchers from ${(institution.departments && institution.departments[0]) || 'Engineering'} to test hardware degradation and sample local conditions.`,
        department: (institution.departments && institution.departments[0]) || "Civil & Mechanical Engineering"
      },
      {
        phase: "Phase 2: Lab Prototyping & Component Refurbishment",
        action: "Conduct stress testing and fabricate ruggedized replacement modules in the campus research facilities.",
        department: (institution.activeLabs && institution.activeLabs[0]) || "Departmental Laboratories"
      },
      {
        phase: "Phase 3: Field Deployment & Community Handover",
        action: "Install refurbished components, integrate telemetry monitoring sensors, and brief local operators.",
        department: "Rural Technology Action Group (RuTAG)"
      }
    ];

    const finalBreakdown = liveDetails?.matchBreakdown || {
      domainRelevance: 95,
      departmentFit: 93,
      researchInfrastructure: 94,
      geographicProximity: 96
    };

    return res.json({
      success: true,
      source: liveDetails ? "openrouter" : "curated",
      model: liveDetails ? model : "University Profile",
      data: {
        ...institution,
        facultyRecommendation: liveDetails?.facultyRecommendation || `Leading regional research center with specialized laboratory facilities directly applicable to ${problemTitle}.`,
        estimatedResolutionTime: liveDetails?.estimatedResolutionTime || "2 - 3 weeks",
        matchBreakdown: finalBreakdown,
        actionPlan: finalActionPlan
      }
    });

  } catch (err) {
    console.error("[Institution Details Error]", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
