import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import * as Speech from "expo-speech";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import Button from "../../components/Button";
import InterviewHeader from "../../components/InterviewHeader";
import TextInputMulLine from "../../components/TextInputMulLine";
import AnimatedQuestion from "../../components/AnimatedQuestion";
import styles from "../../styles/global";

const QuestionAndAnswer = ({ route }) => {
  const navigation = useNavigation();

  const { targetJob, interviewCategory, responseMode, numberOfQuestions } =
    route.params;

  const totalQuestions = Number(numberOfQuestions);

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const [isTextMode, setIsTextMode] = useState(responseMode === "Text");

  const [response, setResponse] = useState("");

  const [timeLeft, setTimeLeft] = useState(60);

  const questions = [
    `Tell me about yourself and your experience as a ${targetJob}.`,

    `Why are you interested in the ${targetJob} role?`,

    `What are your biggest strengths as a ${targetJob}?`,

    `Tell me about a challenging project you worked on.`,

    `How do you handle tight deadlines and pressure?`,

    `Where do you see yourself in the next five years?`,

    `Why should we hire you for this ${targetJob} position?`,

    `Tell me about a time you solved a difficult problem.`,

    `What skills do you think are most important for a ${targetJob}?`,

    `Do you have any questions for us?`,
  ];

  const currentQuestionText = questions[currentQuestion - 1];

  const speakQuestion = () => {
    if (!currentQuestionText) {
      return;
    }

    Speech.stop();

    Speech.speak(currentQuestionText, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  useEffect(() => {
    // Don't speak in Text Mode
    if (isTextMode) {
      Speech.stop();
      return;
    }

    if (!currentQuestionText) {
      return;
    }

    // Small delay so the new question
    // is already displayed before speech starts.
    const timeout = setTimeout(() => {
      speakQuestion();
    }, 300);

    return () => {
      clearTimeout(timeout);
      Speech.stop();
    };
  }, [currentQuestion, isTextMode]);

  useEffect(() => {
    setTimeLeft(60);
    setResponse("");
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleSwitchMode = () => {
    setIsTextMode((prev) => !prev);
  };

  const handleReplayQuestion = () => {
    if (isTextMode) {
      return;
    }

    speakQuestion();
  };

  const handleNextQuestion = () => {
    // Stop current speech
    Speech.stop();

    console.log("---------------------------");
    console.log("Question:", currentQuestion);
    console.log("Target Job:", targetJob);
    console.log("Category:", interviewCategory);
    console.log("Response Mode:", isTextMode ? "Text" : "Audio");
    console.log("Response:", response);
    console.log("---------------------------");

    if (currentQuestion < totalQuestions) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Interview completed
      navigation.navigate("SessionCompleted");
    }
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel={`Question ${currentQuestion} out of ${totalQuestions}`}
          navigateTo="Interview"
          questionNumber={currentQuestion}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {/* Current mode */}

          <View
            style={{
              borderWidth: 1,
              borderColor: "#2563EB",
              padding: 7,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              {isTextMode ? "Text Mode" : "Audio Mode"}
            </Text>
          </View>

          {/* Switch mode */}

          <TouchableOpacity onPress={handleSwitchMode} activeOpacity={0.7}>
            <Text
              style={{
                color: "#F8FAFC",
                fontWeight: "700",
                fontSize: 13,
                textDecorationLine: "underline",
              }}
            >
              Switch Mode
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            backgroundColor: "#25252F",
            minHeight: 150,
            paddingHorizontal: 20,
            paddingTop: 5,
            paddingBottom: 15,
            borderRadius: 16,
          }}
        >
          {/* Label */}

          <Text
            style={{
              color: "#71717A",
              fontSize: 15,
              fontWeight: "700",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            AI INTERVIEWER
          </Text>

          {/* Animated question */}

          <AnimatedQuestion
            key={currentQuestion}
            animationKey={currentQuestion}
            text={currentQuestionText}
          />
        </View>

        {!isTextMode && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleReplayQuestion}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#2563EB",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
              }}
            >
              <Ionicons name="volume-high-outline" color="#F8FAFC" size={16} />

              <Text
                style={{
                  color: "#F8FAFC",
                  fontWeight: "700",
                  marginLeft: 6,
                  fontSize: 12,
                }}
              >
                Replay
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 18,
            fontWeight: "700",
            marginTop: 15,
          }}
        >
          Your Response
        </Text>

        {isTextMode ? (
          <TextInputMulLine
            height={250}
            value={response}
            onChangeText={setResponse}
            placeholder="Type your response here..."
          />
        ) : (
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#25252F",
              height: 250,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#2563EB",
                padding: 15,
                borderRadius: 50,
                marginBottom: 15,
              }}
            >
              <Ionicons name="mic-outline" color="white" size={80} />
            </View>

            {/* Record button */}

            <TouchableOpacity activeOpacity={0.7}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#2563EB",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "#F8FAFC",
                    fontWeight: "700",
                  }}
                >
                  Record Now
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
        }}
        title={
          currentQuestion === totalQuestions
            ? "Finish Interview"
            : "Submit Answer"
        }
        onPress={handleNextQuestion}
      />
    </View>
  );
};

export default QuestionAndAnswer;
