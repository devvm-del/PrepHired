import { API_URL } from "../config/api";

import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// CREATE DRAFT
export const createResume = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume`, {
    method: "POST",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// GET DRAFT
export const getDraftResume = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/draft`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// GET RESUME
export const getResume = async (id) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// STEP 1 - BASIC INFO
export const saveBasicInfo = async (id, basicInfo) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/basic-info`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      fullName: basicInfo.fullName,
      contactNumber: basicInfo.contactNumber,
      address: basicInfo.address,
      email: basicInfo.email,
      linkedInURL: basicInfo.linkedInURL,
      portfolioLink: basicInfo.portfolioLink,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// STEP 2 - TARGET JOB
export const saveTargetJob = async (
  id,
  targetJob,
  industry,
  jobDescription,
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/target-job`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      jobTitle: targetJob.jobTitle,
      industry: targetJob.industry,
      jobDescription: targetJob.jobDescription,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// STEP 3 - WORK EXPERIENCE
export const saveWorkExperience = async (
  id,
  workExperiences,
  noWorkExperience,
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/resume/${id}/work-experience`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        workExperiences,
        noWorkExperience,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// STEP 4 - EDUCATION
export const saveEducation = async (id, educations) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/education`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      educations,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// STEP 5 - SUMMARY & EXTRAS
export const saveSummaryExtras = async (
  id,
  { professionalSummary, skills, projects, certificates },
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/resume/${id}/summary-extras`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        professionalSummary,
        skills,
        projects,
        certificates,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// AI - GENERATE PROFESSIONAL SUMMARY
export const generateSummary = async (id) => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/mobile/resume/${id}/generate-summary`,
    {
      method: "POST",
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

export const analyzeResume = async (id) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/analyze`, {
    method: "POST",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

export const optimizeResume = async (id) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/optimize`, {
    method: "POST",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message || "Failed to optimize resume",

      errors: data.errors || {},
    };
  }

  return data;
};

export const saveResumeTemplate = async (id, template) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/template`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ template }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// COMPLETE RESUME
export const completeResume = async (id) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/complete`, {
    method: "PUT",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

//GET RESUME
export const getCompletedResumes = async () => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/completed`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message,
      errors: data.errors || {},
    };
  }

  return data;
};

// EXPORT RESUME AS PDF
export const exportResumePDF = async (id) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/mobile/resume/${id}/export-pdf`, {
    method: "GET",
    headers,
  });

  console.log("PDF STATUS:", response.status);
  console.log("PDF CONTENT TYPE:", response.headers.get("content-type"));

  if (!response.ok) {
    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      console.log("PDF error response:", error);
    }

    throw {
      message: data.message || "Failed to export resume PDF",
      errors: data.errors || {},
    };
  }

  const arrayBuffer = await response.arrayBuffer();

  console.log("PDF BYTE LENGTH:", arrayBuffer.byteLength);

  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    throw {
      message: "Server returned an empty PDF.",
      errors: {},
    };
  }

  return {
    arrayBuffer,
    fileName: "resume.pdf",
  };
};
