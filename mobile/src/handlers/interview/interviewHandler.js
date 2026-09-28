export const interviewHandler = ({
  targetJob,
  setTargetJob,
  setTargetJobError,
  selectedInterviewCategory,
  selectedResponseMode,
  selectedNumberOfQuestions,
  navigation,
  create,
}) => {
  const handleTargetJobChange = (text) => {
    setTargetJob(text);
    setTargetJobError("");
  };

  const handleStartInterview = async () => {
    try {
      const result = await create({
        targetJob: targetJob.trim(),
        interviewCategory: selectedInterviewCategory,
        responseMode: selectedResponseMode,
        numberOfQuestions: Number(selectedNumberOfQuestions),
      });

      const mockInterviewId = result.mockInterview?.id;

      navigation.navigate("QuestionAndAnswer", {
        mockInterviewId,
        mockInterview: result.mockInterview,
        targetJob: targetJob.trim(),
        interviewCategory: selectedInterviewCategory,
        responseMode: selectedResponseMode,
        numberOfQuestions: Number(selectedNumberOfQuestions),
      });
    } catch (error) {
      setTargetJobError(
        error?.errors?.targetJob ||
          error?.message ||
          "Failed to start mock interview.",
      );
    }
  };

  return {
    handleTargetJobChange,
    handleStartInterview,
  };
};
