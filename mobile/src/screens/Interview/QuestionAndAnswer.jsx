import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

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

  const {
    mockInterview,
    targetJob,
    interviewCategory,
    responseMode,
    numberOfQuestions,
    token,
  } = route.params || {};

  const {
    saveAnswer,
    analyzeAnswer,
    loading,
  } = useMockInterview();

  const [currentQuestion, setCurrentQuestion] =
    useState(1);

  const [response, setResponse] =
    useState("");

  const [timeLeft, setTimeLeft] =
    useState(60);

  const [isTextMode, setIsTextMode] =
    useState(responseMode === "Text");

  const questions =
    mockInterview?.questions || [];

  const totalQuestions =
    questions.length ||
    Number(numberOfQuestions) ||
    0;

  const currentQuestionData =
    questions[currentQuestion - 1];

  const currentQuestionText =
    currentQuestionData?.question || "";

  const {
    handleReplayQuestion,
    handleSaveAndAnalyze,
    handleTimeOut,
  } = questionAndAnswerHandler({
    mockInterview,
    currentQuestion,
    response,
    timeLeft,
    setCurrentQuestion,
    setResponse,
    setTimeLeft,
    navigation,
    saveAnswer,
    analyzeAnswer,
    token,
  });

  /*
    SPEAK QUESTION IN AUDIO MODE
  */
  useEffect(() => {
    if (!isTextMode && currentQuestionText) {
      const timer = setTimeout(() => {
        Speech.stop();

        Speech.speak(currentQuestionText, {
          language: "en-US",
          pitch: 1,
          rate: 0.9,
        });
      }, 300);

      return () => {
        clearTimeout(timer);
        Speech.stop();
      };
    }

    Speech.stop();

    return () => {
      Speech.stop();
    };
  }, [
    currentQuestion,
    currentQuestionText,
    isTextMode,
  ]);

  /*
    RESET TIMER WHEN QUESTION CHANGES
  */
  useEffect(() => {
    setTimeLeft(60);
    setResponse("");
  }, [currentQuestion]);

  /*
    COUNTDOWN
  */
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeOut();
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

    return () => clearInterval(timer);
  }, [
    timeLeft,
    currentQuestion,
  ]);

  /*
    SWITCH RESPONSE MODE
  */
  const handleSwitchMode = () => {
    Speech.stop();

    setIsTextMode((previous) => !previous);
    setResponse("");
    setTimeLeft(60);
  };

  /*
    NO QUESTIONS
  */
  if (!mockInterview || !currentQuestionData) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          },
        ]}
      >
        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Interview questions are unavailable.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 20,
            backgroundColor: "#2563EB",
            paddingHorizontal: 24,
            paddingVertical: 13,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="AI Interview"
          navigateTo="Interview"
          showTimer={true}
          timeLeft={timeLeft}
        />

        {/* QUESTION PROGRESS */}
        <View
          style={{
            marginTop: 10,
            marginBottom: 22,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: "#71717A",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              QUESTION {currentQuestion}
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {totalQuestions} QUESTIONS
            </Text>
          </View>

          <View
            style={{
              height: 6,
              backgroundColor: "#25252F",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${
                  (currentQuestion / totalQuestions) * 100
                }%`,
                height: "100%",
                backgroundColor: "#2563EB",
              }}
            />
          </View>
        </View>

        {/* RESPONSE MODE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {isTextMode ? "TEXT RESPONSE" : "AUDIO RESPONSE"}
          </Text>

          <TouchableOpacity
            onPress={handleSwitchMode}
            style={{
              backgroundColor: "#25252F",
              borderWidth: 1,
              borderColor: "#3F3F46",
              paddingHorizontal: 13,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#60A5FA",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              Switch to {isTextMode ? "Audio" : "Text"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI INTERVIEWER */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 18,
            padding: 22,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#60A5FA",
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            AI INTERVIEWER
          </Text>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 20,
              lineHeight: 30,
              fontWeight: "700",
            }}
          >
            {currentQuestionText}
          </Text>

          {!isTextMode && (
            <TouchableOpacity
              onPress={handleReplayQuestion}
              style={{
                alignSelf: "flex-start",
                marginTop: 18,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 8,
                backgroundColor: "#18181F",
              }}
            >
              <Text
                style={{
                  color: "#60A5FA",
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                🔊 Replay Question
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TEXT RESPONSE */}
        {isTextMode ? (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <TextInput
              value={response}
              onChangeText={setResponse}
              placeholder="Type your answer here..."
              placeholderTextColor="#71717A"
              multiline
              textAlignVertical="top"
              style={{
                color: "#F8FAFC",
                minHeight: 180,
                fontSize: 15,
                lineHeight: 24,
              }}
            />
          </View>
        ) : (
          /* AUDIO PLACEHOLDER */
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 30,
              marginBottom: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 42,
                marginBottom: 12,
              }}
            >
              🎙️
            </Text>

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 6,
              }}
            >
              Audio Response
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              Audio recording can be added here.
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 18,
                backgroundColor: "#2563EB",
                paddingHorizontal: 22,
                paddingVertical: 12,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "700",
                }}
              >
                Record Now
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* NEXT / SUBMIT */}
        <Button
          title={
            loading
              ? "Analyzing Answer..."
              : currentQuestion === totalQuestions
                ? "Submit Interview"
                : "Submit Answer"
          }
          onPress={handleSaveAndAnalyze}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

export default QuestionAndAnswer;
