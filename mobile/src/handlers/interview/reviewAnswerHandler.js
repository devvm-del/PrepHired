export const reviewAnswerHandler = ({
  mockInterviewId,
  getById,
  token,
  setInterview,
  setLoading,
}) => {
  const loadInterview = async () => {
    if (!mockInterviewId) {
      return;
    }

    try {
      setLoading(true);

      const result = await getById(
        mockInterviewId,
        token,
      );

      setInterview(
        result?.mockInterview || null,
      );
    } catch (error) {
      console.error(
        "Failed to load interview review:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loadInterview,
  };
};