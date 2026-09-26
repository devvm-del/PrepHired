export const answerFeedbackHandler = ({
  mockInterviewId,
  navigation,
  getById,
}) => {
  const handleContinue = async () => {
    try {
      const result =
        await getById(mockInterviewId);

      const latestInterview =
        result?.mockInterview;

      navigation.navigate(
        "SessionCompleted",
        {
          mockInterviewId,
          mockInterview:
            latestInterview,
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
