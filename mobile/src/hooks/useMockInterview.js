import { useState } from "react";

import {
  createMockInterview,
  getMockInterview,
  saveInterviewAnswer,
  analyzeInterviewAnswer,
  analyzeInterviewSession,
  completeMockInterview,
  getCompletedMockInterviews,
} from "../services/mockInterviewService";

const useMockInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async ({
    targetJob,
    interviewCategory,
    responseMode,
    numberOfQuestions,
    token,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await createMockInterview({
        targetJob,
        interviewCategory,
        responseMode,
        numberOfQuestions,
        token,
      });

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (interviewId, token) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getMockInterview(
        interviewId,
        token,
      );

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = async ({
    interviewId,
    questionNumber,
    answer,
    audioUrl,
    timeUsed,
    token,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await saveInterviewAnswer({
        interviewId,
        questionNumber,
        answer,
        audioUrl,
        timeUsed,
        token,
      });

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeAnswer = async ({
    interviewId,
    questionNumber,
    token,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await analyzeInterviewAnswer({
        interviewId,
        questionNumber,
        token,
      });

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeSession = async (
    interviewId,
    token,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const result = await analyzeInterviewSession(
        interviewId,
        token,
      );

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const complete = async (
    interviewId,
    token,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const result = await completeMockInterview(
        interviewId,
        token,
      );

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCompleted = async (token) => {
    try {
      setLoading(true);
      setError(null);

      const result =
        await getCompletedMockInterviews(token);

      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,

    create,
    getById,
    saveAnswer,
    analyzeAnswer,
    analyzeSession,
    complete,
    getCompleted,

    clearError,
  };
};

export default useMockInterview;

