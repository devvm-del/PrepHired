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
  analyzeSession,
  complete,
}) => {
  const questions =
    mockInterview?.questions || [];

  const totalQuestions =
    questions.length;

  const currentQuestionData =
    questions[
      currentQuestion - 1
    ];

  const currentQuestionText =
    currentQuestionData?.question ||
    "";

  /*
    =====================================================
    SAVE ANSWER + MOVE TO NEXT QUESTION
    =====================================================
  */

  const handleSaveAndAnalyze =
    async () => {
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

      try {
        /*
          SAVE CURRENT ANSWER
        */

        await saveAnswer({
          interviewId:
            mockInterview._id,

          questionNumber:
            currentQuestion,

          answer:
            response?.trim() || "",

          audioUrl: "",

          timeUsed:
            60 - timeLeft,
        });

        /*
          MORE QUESTIONS
        */

        if (
          currentQuestion <
          totalQuestions
        ) {
          setResponse("");

          setTimeLeft(60);

          setCurrentQuestion(
            (previous) =>
              previous + 1,
          );

          return;
        }

        /*
          ALL QUESTIONS ANSWERED
        */

        const sessionResult =
          await analyzeSession(
            mockInterview._id,
          );

        /*
          MARK INTERVIEW COMPLETE
        */

        const completedResult =
          await complete(
            mockInterview._id,
          );

        /*
          NAVIGATE TO RESULTS
        */

        navigation.navigate(
          "SessionCompleted",
          {
            mockInterviewId:
              mockInterview._id,

            mockInterview:
              completedResult?.mockInterview ||
              sessionResult?.mockInterview ||
              mockInterview,
          },
        );
      } catch (error) {
        console.error(
          "Interview answer flow error:",
          error,
        );

        throw error;
      }
    };

  /*
    =====================================================
    TIMER EXPIRED
    =====================================================
  */

  const handleTimeOut =
    async () => {
      if (timeLeft > 0) {
        return;
      }

      try {
        await handleSaveAndAnalyze();
      } catch (error) {
        console.error(
          "Interview timeout error:",
          error,
        );
      }
    };

  return {
    questions,

    totalQuestions,

    currentQuestionData,

    currentQuestionText,

    handleSaveAndAnalyze,

    handleTimeOut,
  };
};
