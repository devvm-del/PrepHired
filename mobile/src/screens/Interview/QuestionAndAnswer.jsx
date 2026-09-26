import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  PermissionsAndroid,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import * as Speech from "expo-speech";
import Voice from "@react-native-voice/voice";

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
  } = route.params || {};

  const {
    saveAnswer,
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

  const [isTextMode, setIsTextMode] =
    useState(responseMode === "Text");

  // Voice states
  const [isListening, setIsListening] =
    useState(false);

  const [voiceError, setVoiceError] =
    useState("");

  const submittingRef = useRef(false);

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
    analyzeSession,
    complete,
  });

  /*
    SUBMIT ANSWER
  */
  const handleSubmitAnswer = async () => {
    if (submittingRef.current) {
      return;
    }

    // Stop microphone before submitting
    if (isListening) {
      try {
        await Voice.stop();
      } catch (error) {
        console.log("Voice stop error:", error);
      }

      setIsListening(false);
    }

    submittingRef.current = true;

    try {
      await handleSaveAndAnalyze();
    } catch (error) {
      console.error(
        "Submit answer error:",
        error,
      );

      submittingRef.current = false;
    }
  };

  /*
    SPEAK QUESTION IN AUDIO MODE
  */
  useEffect(() => {
    if (!isTextMode && currentQuestionText) {
      const timer = setTimeout(() => {
        Speech.stop();

        Speech.speak(
          currentQuestionText,
          {
            language: "en-US",
            pitch: 1,
            rate: 0.9,
          },
        );
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
    VOICE RECOGNITION SETUP
  */
  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsListening(true);
      setVoiceError("");
    };

    Voice.onSpeechEnd = () => {
      setIsListening(false);
    };

    Voice.onSpeechResults = (event) => {
      const results = event.value || [];

      if (results.length > 0) {
        setResponse(results[0]);
      }
    };

    Voice.onSpeechPartialResults = (event) => {
      const results = event.value || [];

      if (results.length > 0) {
        setResponse(results[0]);
      }
    };

    Voice.onSpeechError = (event) => {
      console.log(
        "Speech recognition error:",
        event,
      );

      setIsListening(false);

      setVoiceError(
        "Unable to recognize speech. Please try again.",
      );
    };

    return () => {
      Voice.destroy()
        .then(() => {
          Voice.removeAllListeners();
        });
    };
  }, []);

  /*
    REQUEST MICROPHONE PERMISSION - ANDROID
  */
  const requestMicrophonePermission =
    async () => {
      if (Platform.OS !== "android") {
        return true;
      }

      try {
        const granted =
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title:
                "Microphone Permission",
              message:
                "This app needs access to your microphone to record your interview answer.",
              buttonPositive: "Allow",
              buttonNegative: "Deny",
            },
          );

        return (
          granted ===
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error(
          "Microphone permission error:",
          error,
        );

        return false;
      }
    };

  /*
    START / STOP SPEECH RECOGNITION
  */
  const toggleRecording = async () => {
    if (submittingRef.current) {
      return;
    }

    setVoiceError("");

    /*
      STOP RECORDING
    */
    if (isListening) {
      try {
        await Voice.stop();
      } catch (error) {
        console.log(
          "Stop voice error:",
          error,
        );
      }

      setIsListening(false);
      return;
    }

    /*
      REQUEST MICROPHONE PERMISSION
    */
    const permission =
      await requestMicrophonePermission();

    if (!permission) {
      setVoiceError(
        "Microphone permission is required.",
      );

      return;
    }

    /*
      Stop the AI question audio first.
    */
    Speech.stop();

    /*
      Start speech recognition.
    */
    try {
      setResponse("");

      await Voice.start("en-US");

      setIsListening(true);
    } catch (error) {
      console.error(
        "Start voice error:",
        error,
      );

      setIsListening(false);

      setVoiceError(
        "Could not start voice recognition.",
      );
    }
  };

  /*
    RESET TIMER WHEN QUESTION CHANGES
  */
  useEffect(() => {
    setTimeLeft(60);
    setResponse("");

    submittingRef.current = false;

    // Stop microphone when moving to next question
    if (isListening) {
      Voice.stop().catch(() => {});
      setIsListening(false);
    }
  }, [currentQuestion]);

  /*
    COUNTDOWN
  */
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitAnswer();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (previous) => previous - 1,
      );
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    timeLeft,
    currentQuestion,
  ]);

  /*
    SWITCH RESPONSE MODE
  */
  const handleSwitchMode = async () => {
    if (submittingRef.current) {
      return;
    }

    Speech.stop();

    if (isListening) {
      try {
        await Voice.stop();
      } catch (error) {
        console.log(error);
      }

      setIsListening(false);
    }

    setIsTextMode(
      (previous) => !previous,
    );

    setResponse("");
    setTimeLeft(60);
    setVoiceError("");
  };

  /*
    NO QUESTIONS
  */
  if (
    !mockInterview ||
    !currentQuestionData
  ) {
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
          onPress={() =>
            navigation.goBack()
          }
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
        contentContainerStyle={
          styles.scrollContent
        }
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
              justifyContent:
                "space-between",
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
              backgroundColor:
                "#25252F",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${
                  totalQuestions > 0
                    ? (
                        currentQuestion /
                        totalQuestions
                      ) * 100
                    : 0
                }%`,
                height: "100%",
                backgroundColor:
                  "#2563EB",
              }}
            />
          </View>
        </View>

        {/* RESPONSE MODE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
              "space-between",
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
            {isTextMode
              ? "TEXT RESPONSE"
              : "AUDIO RESPONSE"}
          </Text>

          <TouchableOpacity
            onPress={
              handleSwitchMode
            }
            style={{
              backgroundColor:
                "#25252F",
              borderWidth: 1,
              borderColor:
                "#3F3F46",
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
              Switch to{" "}
              {isTextMode
                ? "Audio"
                : "Text"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI INTERVIEWER */}
        <View
          style={{
            backgroundColor:
              "#25252F",
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
              onPress={
                handleReplayQuestion
              }
              style={{
                alignSelf:
                  "flex-start",
                marginTop: 18,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 8,
                backgroundColor:
                  "#18181F",
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
              backgroundColor:
                "#25252F",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <TextInput
              value={response}
              onChangeText={
                setResponse
              }
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
          /* SPEECH-TO-TEXT RESPONSE */
          <View
            style={{
              backgroundColor:
                "#25252F",
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              alignItems:
                "center",
            }}
          >
            <Text
              style={{
                fontSize: 42,
                marginBottom: 12,
              }}
            >
              {isListening
                ? "🔴"
                : "🎙️"}
            </Text>

            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              {isListening
                ? "Listening..."
                : "Voice Response"}
            </Text>

            <Text
              style={{
                color: "#71717A",
                fontSize: 13,
                textAlign:
                  "center",
                marginBottom: 16,
              }}
            >
              {isListening
                ? "Speak your answer. Tap the button when you are finished."
                : "Tap the button and speak your interview answer."}
            </Text>

            {/* LIVE TRANSCRIPT */}
            {response.length > 0 && (
              <View
                style={{
                  width: "100%",
                  backgroundColor:
                    "#18181F",
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 18,
                }}
              >
                <Text
                  style={{
                    color: "#60A5FA",
                    fontSize: 11,
                    fontWeight: "800",
                    marginBottom: 7,
                  }}
                >
                  YOUR ANSWER
                </Text>

                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 15,
                    lineHeight: 23,
                  }}
                >
                  {response}
                </Text>
              </View>
            )}

            {/* RECORD BUTTON */}
            <TouchableOpacity
              onPress={
                toggleRecording
              }
              disabled={loading}
              style={{
                backgroundColor:
                  isListening
                    ? "#DC2626"
                    : "#2563EB",
                paddingHorizontal: 25,
                paddingVertical: 13,
                borderRadius: 10,
                minWidth: 150,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "700",
                }}
              >
                {isListening
                  ? "Stop Listening"
                  : response
                    ? "Record Again"
                    : "Record Now"}
              </Text>
            </TouchableOpacity>

            {voiceError ? (
              <Text
                style={{
                  color: "#F87171",
                  fontSize: 12,
                  textAlign:
                    "center",
                  marginTop: 12,
                }}
              >
                {voiceError}
              </Text>
            ) : null}
          </View>
        )}
      </ScrollView>

      <Button
        style={{ marginBottom: 65 }}
        title={
          loading
            ? "Saving..."
            : currentQuestion ===
                totalQuestions
              ? "Submit Interview"
              : "Submit Answer"
        }
        loading={loading}
        onPress={
          handleSubmitAnswer
        }
        disabled={
          loading ||
          submittingRef.current
        }
      />
    </View>
  );
};

export default QuestionAndAnswer;
