export const answerFeedbackHandler = ({
  mockInterviewId,
  questionNumber,
  totalQuestions,
  navigation,
  getById,
  analyzeSession,
  complete,
  token,
}) => {
  const handleContinue = async () => {
    try {
      /*
        Get the latest interview state.
      */
      const result = await getById(
        mockInterviewId,
        token,
      );

      const latestInterview =
        result?.mockInterview;

      /*
        More questions remain.
      */
      if (questionNumber < totalQuestions) {
        navigation.navigate(
          "QuestionAndAnswer",
          {
            mockInterview: latestInterview,
            currentQuestion: questionNumber + 1,
            targetJob: latestInterview?.targetJob,
            interviewCategory:
              latestInterview?.interviewCategory,
            responseMode:
              latestInterview?.responseMode,
            numberOfQuestions:
              totalQuestions,
            token,
          },
        );

        return;
      }

      /*
        Final question:
        analyze the complete session.
      */
      const sessionResult =
        await analyzeSession(
          mockInterviewId,
          token,
        );

      /*
        Mark interview completed.
      */
      const completedResult =
        await complete(
          mockInterviewId,
          token,
        );

      navigation.navigate(
        "SessionCompleted",
        {
          mockInterviewId,
          mockInterview:
            completedResult?.mockInterview ||
            sessionResult?.mockInterview ||
            latestInterview,
          token,
        },
      );
    } catch (error) {
      console.error(
        "Continue feedback error:",
        error,
      );
    }
  };

  return {
    handleContinue,
  };
};