import { API_URL } from "../config/api";

export const createMockInterview = async ({
  targetJob,
  interviewCategory,
  responseMode,
  numberOfQuestions,
  token,
}) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        targetJob,
        interviewCategory,
        responseMode,
        numberOfQuestions,
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


export const getMockInterview = async (
  interviewId,
  token,
) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview/${interviewId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const saveInterviewAnswer = async ({
  interviewId,
  questionNumber,
  answer,
  audioUrl,
  timeUsed,
  token,
}) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview/${interviewId}/answer`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionNumber,
        answer,
        audioUrl,
        timeUsed,
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

export const analyzeInterviewAnswer = async ({
  interviewId,
  questionNumber,
  token,
}) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview/${interviewId}/analyze-answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionNumber,
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

export const analyzeInterviewSession = async (
  interviewId,
  token,
) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview/${interviewId}/analyze-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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


export const completeMockInterview = async (
  interviewId,
  token,
) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview/${interviewId}/complete`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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


export const getCompletedMockInterviews = async (
  token,
) => {
  const response = await fetch(
    `${API_URL}/mobile/mock-interview/completed`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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