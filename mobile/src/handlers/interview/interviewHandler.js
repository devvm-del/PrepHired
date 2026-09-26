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
    if (!targetJob.trim()) {
      setTargetJobError(
        "Please enter the role you are targeting.",
      );
      return;
    }

    try {
      const result = await create({
        targetJob: targetJob.trim(),
        interviewCategory:
          selectedInterviewCategory,
        responseMode:
          selectedResponseMode,
        numberOfQuestions:
          Number(selectedNumberOfQuestions),
      });

      navigation.navigate(
        "QuestionAndAnswer",
        {
          mockInterview:
            result.mockInterview,
          targetJob:
            targetJob.trim(),
          interviewCategory:
            selectedInterviewCategory,
          responseMode:
            selectedResponseMode,
          numberOfQuestions:
            Number(selectedNumberOfQuestions),
        },
      );
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
