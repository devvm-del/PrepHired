const PYTHON_AI_URL = process.env.PYTHON_AI_URL;

const generateProfessionalSummary = async (resume) => {
  try {
    const response = await fetch(`${PYTHON_AI_URL}/generate-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetJob: resume.targetJob || {},

        workExperiences: resume.workExperiences || [],

        educations: resume.educations || [],

        skills: resume.skills || "",

        projects: resume.projects || [],

        certificates: resume.certificates || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data?.detail?.message ||
          data?.message ||
          "Failed to generate professional summary",
      );

      error.status = response.status;
      error.retryAfter = data?.detail?.retryAfter || null;

      throw error;
    }

    console.log("AI Summary Response:", JSON.stringify(data, null, 2));

    return data.summary;
  } catch (error) {
    console.error(
      "Python AI service error:",
      error.response?.data || error.message,
    );

    throw new Error("Failed to generate professional summary");
  }
};

const generateResumeAnalysis = async (resume) => {
  const response = await fetch(`${PYTHON_AI_URL}/analyze-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      basicInfo: resume.basicInfo || {},

      targetJob: resume.targetJob || {},

      professionalSummary: resume.professionalSummary || "",

      workExperiences: resume.workExperiences || [],

      educations: resume.educations || [],

      skills: resume.skills || "",

      projects: resume.projects || [],

      certificates: resume.certificates || "",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.detail?.message || data?.message || "Failed to analyze resume",
    );

    error.status = response.status;
    error.retryAfter = data?.detail?.retryAfter || null;

    throw error;
  }

  console.log("AI Analysis Response:", JSON.stringify(data, null, 2));

  return data.analysis;
};

const optimizeResume = async (resume) => {
  const response = await fetch(`${PYTHON_AI_URL}/optimize-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      basicInfo: resume.basicInfo || {},

      targetJob: resume.targetJob || {},

      professionalSummary: resume.professionalSummary || "",

      workExperiences: resume.workExperiences || [],

      educations: resume.educations || [],

      skills: resume.skills || "",

      projects: resume.projects || [],

      certificates: resume.certificates || "",

      aiAnalysis: resume.aiAnalysis || {},
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.detail?.message || data?.message || "Failed to optimize resume",
    );

    error.status = response.status;
    error.retryAfter = data?.detail?.retryAfter || null;

    throw error;
  }

  console.log("AI Optimization Response:", JSON.stringify(data, null, 2));

  return data.optimization;
};

//Mock Interview
const generateInterviewQuestions = async ({
  targetJob,
  interviewCategory,
  numberOfQuestions,
}) => {
  try {
    const response = await fetch(
      `${PYTHON_AI_URL}/generate-interview-questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetJob: targetJob || "",
          interviewCategory: interviewCategory || "All",
          numberOfQuestions: numberOfQuestions || 5,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data?.detail?.message ||
          data?.message ||
          "Failed to generate interview questions",
      );

      error.status = response.status;
      error.retryAfter = data?.detail?.retryAfter || null;

      throw error;
    }

    console.log(
      "AI Interview Questions Response:",
      JSON.stringify(data, null, 2),
    );

    return data.questions;
  } catch (error) {
    console.error("Python AI service error:", error.message);

    throw new Error("Failed to generate interview questions");
  }
};

const analyzeInterviewAnswer = async ({
  targetJob,
  interviewCategory,
  question,
  answer,
}) => {
  try {
    const response = await fetch(`${PYTHON_AI_URL}/analyze-interview-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetJob: targetJob || "",
        interviewCategory: interviewCategory || "All",
        question: question || "",
        answer: answer || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data?.detail?.message ||
          data?.message ||
          "Failed to analyze interview answer",
      );

      error.status = response.status;
      error.retryAfter = data?.detail?.retryAfter || null;

      throw error;
    }

    console.log("AI Interview Answer Response:", JSON.stringify(data, null, 2));

    return data.analysis;
  } catch (error) {
    console.error("Python AI service error:", error.message);

    throw new Error("Failed to analyze interview answer");
  }
};

const analyzeInterviewSession = async ({
  targetJob,
  interviewCategory,
  questions,
}) => {
  try {
    const response = await fetch(`${PYTHON_AI_URL}/analyze-interview-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        targetJob: targetJob || "",
        interviewCategory: interviewCategory || "All",
        questions: questions || [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data?.detail?.message ||
          data?.message ||
          "Failed to analyze interview session",
      );

      error.status = response.status;
      error.retryAfter = data?.detail?.retryAfter || null;

      throw error;
    }

    console.log(
      "AI Interview Session Response:",
      JSON.stringify(data, null, 2),
    );

    return data.analysis;
  } catch (error) {
    console.error("Python AI service error:", error.message);

    throw new Error("Failed to analyze interview session");
  }
};

module.exports = {
  generateProfessionalSummary,
  generateResumeAnalysis,
  optimizeResume,
  generateInterviewQuestions,
  analyzeInterviewAnswer,
  analyzeInterviewSession,
};
