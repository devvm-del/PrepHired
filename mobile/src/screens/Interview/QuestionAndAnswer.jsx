import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import InterviewHeader from "../../components/InterviewHeader";
import Button from "../../components/Button";

import styles from "../../styles/global";

import useMockInterview from "../../hooks/useMockInterview";

import {
  questionAndAnswerHandler,
} from "../../handlers/interview/questionAndAnswerHandler";

const QuestionAndAnswer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const mockInterviewId =
    route.params?.mockInterviewId;

  const {
    mockInterview,
    targetJob,
    interviewCategory,
    responseMode,
    numberOfQuestions,
  } = route.params || {};

  const {
    saveAnswer,
    analyzeAnswer,
    analyzeSession,
    complete,
    loading,
  } = useMockInterview();

  const [currentQuestion, setCurrentQuestion] =
    useState(1);

  const [response, setResponse] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [answerError, setAnswerError] =
    useState("");

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  // Prevent double submission / timeout
  const processingRef = useRef(false);

  // --------------------------------
  // QUESTION HANDLER
  // --------------------------------

  const {
    questions,
    totalQuestions,
    currentQuestionData,
    currentQuestionText,
    handleSaveAndContinue,
    handleTimeOut,
  } = questionAndAnswerHandler({
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
  });

  // --------------------------------
  // RESET QUESTION STATE
  // --------------------------------

  useEffect(() => {
    setTimeLeft(60);
    setResponse("");
    setAnswerError("");

    Speech.stop();
    setIsSpeaking(false);
  }, [currentQuestion]);

  // --------------------------------
  // TIMER
  // --------------------------------

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  // --------------------------------
  // REPLAY QUESTION
  // --------------------------------

  const handleSpeakQuestion = async () => {
    if (!currentQuestionText) {
      return;
    }

    try {
      const speaking =
        await Speech.isSpeakingAsync();

      if (speaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      Speech.speak(
        currentQuestionText,
        {
          language: "en-US",
          rate: 0.9,
          pitch: 1.0,

          onDone: () => {
            setIsSpeaking(false);
          },

          onStopped: () => {
            setIsSpeaking(false);
          },

          onError: () => {
            setIsSpeaking(false);
          },
        },
      );
    } catch (error) {
      console.error(
        "Speech error:",
        error,
      );

      setIsSpeaking(false);
    }
  };

  // --------------------------------
  // STOP SPEECH ON UNMOUNT
  // --------------------------------

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // --------------------------------
  // TIMEOUT
  // --------------------------------

  useEffect(() => {
    if (timeLeft !== 0) {
      return;
    }

    handleTimeOut();
  }, [timeLeft]);

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: 130,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <InterviewHeader
          navigation={navigation}
          interviewLabel="Question & Answer"
          questionNumber={currentQuestion}
          mockInterviewId={mockInterviewId}
          navigateTo="Interview"
          showTimer={true}
          goBack={true}
          backIcon="exit"
        />

        {/* QUESTION PROGRESS */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#71717A",
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            QUESTION {currentQuestion} OF{" "}
            {totalQuestions}
          </Text>
        </View>

        {/* PROGRESS BAR */}

        <View
          style={{
            height: 6,
            backgroundColor: "#18181F",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              width: `${
                totalQuestions > 0
                  ? Math.min(
                      (currentQuestion /
                        totalQuestions) *
                        100,
                      100,
                    )
                  : 0
              }%`,
              height: "100%",
              backgroundColor:
                "#2563EB",
            }}
          />
        </View>

        {/* QUESTION CARD */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 18,
            padding: 20,
            marginBottom: 18,
          }}
        >
          {/* QUESTION HEADER */}

          <View
            style={{
              flexDirection: "row",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#60A5FA",
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 1,
                flex: 1,
              }}
            >
              INTERVIEW QUESTION
            </Text>

            {/* REPLAY BUTTON */}

            <TouchableOpacity
              onPress={
                handleSpeakQuestion
              }
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  "#18181F",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                marginLeft: 10,
              }}
            >
              <Ionicons
                name={
                  isSpeaking
                    ? "stop-circle"
                    : "volume-high"
                }
                size={18}
                color="#60A5FA"
              />

              <Text
                style={{
                  color: "#60A5FA",
                  fontSize: 12,
                  fontWeight: "700",
                  marginLeft: 6,
                }}
              >
                {isSpeaking
                  ? "Stop"
                  : "Replay Question"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* QUESTION TEXT */}

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 19,
              lineHeight: 28,
              fontWeight: "700",
            }}
          >
            {currentQuestionText}
          </Text>
        </View>

        {/* RESPONSE */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 18,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 13,
              fontWeight: "800",
              marginBottom: 10,
            }}
          >
            YOUR ANSWER
          </Text>

          {/* AUDIO MODE */}

          {responseMode === "Audio" ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 25,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor:
                    "#2563EB",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="mic"
                  size={32}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <Text
                style={{
                  color: "#71717A",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Audio recording can be
                connected here.
              </Text>
            </View>
          ) : (
            /* TEXT MODE */

            <TextInput
              value={response}
              onChangeText={(text) => {
                setResponse(text);

                if (answerError) {
                  setAnswerError("");
                }
              }}
              multiline
              textAlignVertical="top"
              placeholder="Type your answer..."
              placeholderTextColor="#71717A"
              style={{
                minHeight: 180,
                backgroundColor:
                  "#18181F",
                borderRadius: 12,
                padding: 15,
                color: "#F8FAFC",
                fontSize: 14,
                lineHeight: 22,
              }}
            />
          )}

          {/* ANSWER ERROR */}

          {answerError ? (
            <Text
              style={{
                color: "#DC2626",
                fontSize: 12,
                marginTop: 10,
              }}
            >
              {answerError}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {/* BUTTON */}

      <Button
        style={{
          marginBottom: 65,
        }}
        title={
          loading
            ? "Saving..."
            : currentQuestion <
                totalQuestions
              ? "Save Answer"
              : "Submit Answer"
        }
        onPress={
          handleSaveAndContinue
        }
        disabled={
          loading ||
          processingRef.current
        }
      />
    </View>
  );
};

export default QuestionAndAnswer;
