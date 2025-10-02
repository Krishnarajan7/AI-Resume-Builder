import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ---------------- Retry wrapper ---------------- */
const exponentialBackoff = async (fn, maxRetries = 5, delay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      if (attempt === maxRetries - 1) throw error;
      const sleepTime = delay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
    }
  }
};

/* ---------------- Generic OpenAI call ---------------- */
export const callOpenAI = async ({ systemPrompt, userQuery, maxTokens = 500 }) => {
  const response = await exponentialBackoff(() =>
    openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    })
  );

  const resultText = response.choices?.[0]?.message?.content;
  if (!resultText) throw new Error("OpenAI returned empty response.");
  return resultText;
};

/* ---------------- Per-field Helpers ---------------- */
export const enhanceText = async (text, instruction) => {
  const systemPrompt =
    "You are a professional editor. Refine text according to user instructions for clarity, grammar, and professional tone.";
  const userQuery = `Instruction: "${instruction}". Text:\n\n${text}`;
  return await callOpenAI({ systemPrompt, userQuery });
};

export const enhanceSummary = async (summary, instruction) => {
  const systemPrompt =
    "You are a career coach. Rewrite text as a concise, high-impact professional summary (3-4 sentences). Active voice + measurable achievements.";
  const userQuery = `Instruction: "${instruction}". Summary:\n\n${summary}`;
  return await callOpenAI({ systemPrompt, userQuery });
};

export const improveBullets = async (bullets, instruction) => {
  const systemPrompt =
    "You are a resume expert. Rewrite bullets using strong action verbs, quantify results, and show impact (STAR method). Return JSON array.";
  const userQuery = `Instruction: "${instruction}". Bullets:\n- ${bullets.join("\n- ")}`;
  const response = await callOpenAI({ systemPrompt, userQuery, maxTokens: 1000 });
  return JSON.parse(response);
};

export const suggestSkills = async (currentSkills, instruction) => {
  const systemPrompt =
    "You are a skills analyst. Suggest 5-8 high-demand skills (technical + soft) missing from the user's list. Return JSON array.";
  const userQuery = `Instruction: "${instruction}". Current skills: ${currentSkills.join(", ")}`;
  const response = await callOpenAI({ systemPrompt, userQuery, maxTokens: 500 });
  return JSON.parse(response);
};

/* ---------------- Section array helper ---------------- */
export const enhanceSections = async (sections, instruction = "") => {
  return await Promise.all(
    sections.map(async (sec) => ({
      title: sec.title,
      enhanced: await enhanceText(sec.text, instruction),
    }))
  );
};
