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
  // SAVE / ANALYZE / NEXT / COMPLETE
  // --------------------------------

  const handleSaveAndContinue =
    async () => {
      // Prevent duplicate calls
      if (processingRef?.current) {
        return;
      }

      if (!mockInterview?._id) {
        throw new Error(
          "Mock interview was not found.",
        );
      }

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

      if (processingRef) {
        processingRef.current = true;
      }

      try {

        const savedResult =
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


        const answerAnalysis =
          await analyzeAnswer({
            interviewId:
              mockInterview._id,

            questionNumber:
              currentQuestion,
          });


        if (
          currentQuestion >=
          totalQuestions
        ) {
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
                answerAnalysis?.mockInterview ||
                savedResult?.mockInterview ||
                mockInterview,
            },
          );

          return;
        }

        const nextQuestion =
          currentQuestion + 1;

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
            "Something went wrong while saving or analyzing your answer.",
        );
      } finally {

        if (processingRef) {
          processingRef.current = false;
        }
      }
    };


  const handleTimeOut = async () => {
    if (timeLeft > 0) {
      return;
    }

    if (
      currentQuestion < 1 ||
      currentQuestion > totalQuestions
    ) {
      return;
    }

    // Prevent duplicate processing
    if (processingRef?.current) {
      return;
    }

    if (processingRef) {
      processingRef.current = true;
    }

    try {

      if (currentQuestion >= totalQuestions) {
        const completedResult =
          await complete(mockInterview._id);

        navigation.navigate(
          "SessionCompleted",
          {
            mockInterviewId:
              mockInterview._id,

            mockInterview:
              completedResult?.mockInterview ||
              mockInterview,
          },
        );

        return;
      }

      const nextQuestion =
        currentQuestion + 1;

      setResponse("");
      setAnswerError("");
      setTimeLeft(60);

      setCurrentQuestion(nextQuestion);

    } catch (error) {
      console.error(
        "Timeout error:",
        error,
      );

      setAnswerError(
        error?.message ||
          "Something went wrong while moving to the next question.",
      );
    } finally {
      if (processingRef) {
        processingRef.current = false;
      }
    }
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
