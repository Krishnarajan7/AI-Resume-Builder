import api from './axios.js'; 

// ---------------- CRUD Operations ----------------
export const createResume = async (resumeData) => {
  try {
    const response = await api.post('/api/v1/resumes', resumeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create resume');
  }
};

export const getResumes = async () => {
  try {
    const response = await api.get('/api/v1/resumes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch resumes');
  }
};

export const getResumeById = async (id) => {
  try {
    const response = await api.get(`/api/v1/resumes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch resume');
  }
};

export const updateResume = async (id, resumeData) => {
  try {
    const response = await api.patch(`/api/v1/resumes/${id}`, resumeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update resume');
  }
};

export const deleteResume = async (id) => {
  try {
    const response = await api.delete(`/api/v1/resumes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete resume');
  }
};

// ---------------- AI Enhancement Endpoints ----------------

// Enhance summary
export const enhanceSummary = async ({ summary, userPrompt = "" }) => {
  if (!summary) throw new Error("Summary text is required");
  try {
    const response = await api.post('/api/v1/resumes/ai/enhance/summary', { summary, userPrompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enhance summary');
  }
};

// Improve bullets
export const improveBullets = async ({ bullets, userPrompt = "" }) => {
  if (!Array.isArray(bullets) || bullets.length === 0) throw new Error("Bullets must be a non-empty array");
  try {
    const response = await api.post('/api/v1/resumes/ai/improve/bullets', { bullets, userPrompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to improve bullets');
  }
};

// Suggest skills
export const suggestSkills = async ({ currentSkills = [], userPrompt = "" }) => {
  if (!Array.isArray(currentSkills)) throw new Error("Current skills must be an array");
  try {
    const response = await api.post('/api/v1/resumes/ai/suggest/skills', { currentSkills, userPrompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to suggest skills');
  }
};

// Enhance multiple sections
export const enhanceSections = async ({ sections, userPrompt = "" }) => {
  if (!Array.isArray(sections) || sections.length === 0) throw new Error("Sections must be a non-empty array");
  try {
    const response = await api.post('/api/v1/resumes/ai/enhance/sections', { sections, userPrompt });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enhance sections');
  }
};
