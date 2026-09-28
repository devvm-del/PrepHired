export const questionAndAnswerHandler = ({
  mockInterview,
  currentQuestion,
  response,
  timeLeft,

  setCurrentQuestion,
  setResponse,
  setTimeLeft,
  setAnswerError,

  navigation,

  saveAnswer,
  analyzeAnswer,
  analyzeSession,
  complete,

  processingRef,
}) => {
  const questions =
    mockInterview?.questions || [];

  const totalQuestions =
    questions.length;

  const currentQuestionData =
    questions[currentQuestion - 1];

  const currentQuestionText =
    currentQuestionData?.question || "";

  // --------------------------------
  // SAVE / NEXT / COMPLETE
  // --------------------------------

  const handleSaveAndContinue =
    async () => {
      // Prevent duplicate calls
      if (processingRef?.current) {
        return;
      }

      // Safety check
      if (!mockInterview?._id) {
        throw new Error(
          "Mock interview was not found.",
        );
      }

      // Safety check
      if (!currentQuestionData) {
        throw new Error(
          "Question was not found.",
        );
      }

      const trimmedAnswer =
        response?.trim() || "";

      if (!trimmedAnswer) {
        setAnswerError(
          "Please provide an answer before continuing.",
        );

        return;
      }

      setAnswerError("");

      // Lock processing
      if (processingRef) {
        processingRef.current = true;
      }

      try {
        // --------------------------------
        // SAVE CURRENT ANSWER
        // --------------------------------

        await saveAnswer({
          interviewId:
            mockInterview._id,

          questionNumber:
            currentQuestion,

          answer:
            trimmedAnswer,

          audioUrl: "",

          timeUsed:
            Math.max(
              0,
              60 - timeLeft,
            ),
        });

        // --------------------------------
        // LAST QUESTION
        // --------------------------------

        if (
          currentQuestion >=
          totalQuestions
        ) {
          const answerAnalysis =
            await analyzeAnswer({
              interviewId:
                mockInterview._id,

              questionNumber:
                currentQuestion,
            });

          const sessionAnalysis =
            await analyzeSession(
              mockInterview._id,
            );

          const completedResult =
            await complete(
              mockInterview._id,
            );

          navigation.navigate(
            "SessionCompleted",
            {
              mockInterviewId:
                mockInterview._id,

              mockInterview:
                completedResult?.mockInterview ||
                sessionAnalysis?.mockInterview ||
                answerAnalysis?.mockInterview ||
                mockInterview,
            },
          );

          return;
        }

        // --------------------------------
        // NEXT QUESTION
        // --------------------------------

        const nextQuestion =
          currentQuestion + 1;

        // Never allow a question
        // beyond the total
        if (
          nextQuestion >
          totalQuestions
        ) {
          return;
        }

        setResponse("");
        setTimeLeft(60);

        setCurrentQuestion(
          nextQuestion,
        );
      } catch (error) {
        console.error(
          "Question and answer flow error:",
          error,
        );

        setAnswerError(
          error?.message ||
            "Something went wrong while saving your answer.",
        );
      } finally {
        // Unlock processing
        if (processingRef) {
          processingRef.current = false;
        }
      }
    };

  // --------------------------------
  // TIMEOUT
  // --------------------------------

  const handleTimeOut = async () => {
    if (timeLeft > 0) {
      return;
    }

    if (
      currentQuestion < 1 ||
      currentQuestion >
        totalQuestions
    ) {
      return;
    }

    await handleSaveAndContinue();
  };

  return {
    questions,
    totalQuestions,
    currentQuestionData,
    currentQuestionText,

    handleSaveAndContinue,
    handleTimeOut,
  };
};
