
import * as Speech from "expo-speech";

export const questionAndAnswerHandler = ({
  mockInterview,
  currentQuestion,
  response,
  timeLeft,
  setCurrentQuestion,
  setResponse,
  setTimeLeft,
  navigation,
  saveAnswer,
  analyzeAnswer,
  token,
}) => {
  const questions = mockInterview?.questions || [];

  const totalQuestions = questions.length;

  const currentQuestionData =
    questions[currentQuestion - 1];

  const currentQuestionText =
    currentQuestionData?.question || "";

  const speakQuestion = () => {
    if (!currentQuestionText) return;

    Speech.stop();

    Speech.speak(currentQuestionText, {
      language: "en-US",
      pitch: 1,
      rate: 0.9,
    });
  };

  const handleReplayQuestion = () => {
    speakQuestion();
  };

  const handleSaveAndAnalyze = async () => {
    if (!mockInterview?._id) {
      throw new Error("Mock interview was not found.");
    }

    if (!currentQuestionData) {
      throw new Error("Question was not found.");
    }

    /*
      Save answer first.
    */
    await saveAnswer({
      interviewId: mockInterview._id,
      questionNumber: currentQuestion,
      answer: response.trim(),
      audioUrl: "",
      timeUsed: 60 - timeLeft,
      token,
    });

    /*
      Analyze the saved answer.
    */
    const analysisResult = await analyzeAnswer({
      interviewId: mockInterview._id,
      questionNumber: currentQuestion,
      token,
    });

    /*
      Move to AnswerFeedback.
    */
    navigation.navigate("AnswerFeedback", {
      mockInterviewId: mockInterview._id,
      questionNumber: currentQuestion,
      totalQuestions,
      targetJob: mockInterview.targetJob,
      interviewCategory: mockInterview.interviewCategory,
      responseMode: mockInterview.responseMode,
      question: analysisResult.question,
      analysis: analysisResult.analysis,
      token,
    });
  };

  const handleNextQuestionLocally = () => {
    if (currentQuestion >= totalQuestions) {
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setResponse("");
    setTimeLeft(60);
  };

  const handleTimeOut = async () => {
    if (timeLeft !== 0) return;

    /*
      Prevent empty timeout submissions from
      crashing the API.
    */
    if (!response.trim()) {
      setResponse("");
    }

    await handleSaveAndAnalyze();
  };

  return {
    questions,
    totalQuestions,
    currentQuestionData,
    currentQuestionText,
    speakQuestion,
    handleReplayQuestion,
    handleSaveAndAnalyze,
    handleNextQuestionLocally,
    handleTimeOut,
  };
};
