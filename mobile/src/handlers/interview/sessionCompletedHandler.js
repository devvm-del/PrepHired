export const sessionCompletedHandler = ({
  mockInterviewId,
  mockInterview,
  getById,
  navigation,
  setInterview,
  setLoading,
}) => {
  const loadInterview = async () => {
    if (!mockInterviewId) {
      setInterview(
        mockInterview || null,
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await getById(mockInterviewId);

      setInterview(
        result?.mockInterview ||
          mockInterview ||
          null,
      );
    } catch (error) {
      console.error(
        "Failed to load completed interview:",
        error,
      );

      setInterview(
        mockInterview || null,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAnswers = () => {
    navigation.navigate(
      "ReviewAnswer",
      {
        mockInterviewId,
      },
    );
  };

  const handleDone = () => {
    navigation.navigate("Home");
  };

  return {
    loadInterview,
    handleReviewAnswers,
    handleDone,
  };
};
