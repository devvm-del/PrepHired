
import React from "react";

import {
  View,
  Text,
  ScrollView,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import InterviewHeader from "../../components/InterviewHeader";
import Button from "../../components/Button";

import styles from "../../styles/global";

import useMockInterview from "../../hooks/useMockInterview";

import {
  answerFeedbackHandler,
} from "../../handlers/interview/answerFeedbackHandler";

const ScoreCard = ({
  title,
  score,
}) => {
  const safeScore =
    Number(score) || 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#25252F",
        borderRadius: 14,
        padding: 16,
        marginHorizontal: 4,
      }}
    >
      <Text
        style={{
          color: "#71717A",
          fontSize: 10,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#F8FAFC",
          fontSize: 25,
          fontWeight: "800",
        }}
      >
        {safeScore}%
      </Text>

      <View
        style={{
          height: 5,
          backgroundColor: "#18181F",
          borderRadius: 20,
          overflow: "hidden",
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: `${Math.min(
              Math.max(safeScore, 0),
              100,
            )}%`,
            height: "100%",
            backgroundColor: "#2563EB",
          }}
        />
      </View>
    </View>
  );
};

const AnswerFeedback = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    mockInterviewId,
    questionNumber,
    totalQuestions,
    question,
    analysis,
    token,
  } = route.params || {};

  const {
    getById,
    analyzeSession,
    complete,
    loading,
  } = useMockInterview();

  const {
    handleContinue,
  } = answerFeedbackHandler({
    mockInterviewId,
    questionNumber,
    totalQuestions,
    navigation,
    getById,
    analyzeSession,
    complete,
    token,
  });

  const feedback =
    analysis?.feedback ||
    "No additional feedback was provided.";

  const tone =
    analysis?.toneAndModulation ||
    "No tone and modulation feedback was provided.";

  const wordChoice =
    analysis?.wordChoiceSuggestions ||
    "No word choice suggestions were provided.";

  const strengths =
    Array.isArray(analysis?.strengths)
      ? analysis.strengths
      : [];

  const improvements =
    Array.isArray(analysis?.improvements)
      ? analysis.improvements
      : [];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Answer Feedback"
          navigateTo="QuestionAndAnswer"
          showTimer={false}
        />

        {/* QUESTION */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#60A5FA",
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1,
              marginBottom: 9,
            }}
          >
            QUESTION {questionNumber}
          </Text>

          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 17,
              lineHeight: 25,
              fontWeight: "700",
            }}
          >
            {question?.question ||
              "Interview question"}
          </Text>
        </View>

        {/* SCORE CARDS */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: -4,
            marginBottom: 20,
          }}
        >
          <ScoreCard
            title="CONTENT"
            score={analysis?.contentScore}
          />

          <ScoreCard
            title="CONFIDENCE"
            score={analysis?.confidenceScore}
          />

          <ScoreCard
            title="NATURAL"
            score={analysis?.naturalScore}
          />
        </View>

        {/* GENERAL FEEDBACK */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
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
            FEEDBACK
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {feedback}
          </Text>
        </View>

        {/* TONE */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
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
            TONE & MODULATION
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {tone}
          </Text>
        </View>

        {/* WORD CHOICE */}
        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
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
            WORD CHOICE SUGGESTIONS
          </Text>

          <Text
            style={{
              color: "#A1A1AA",
              fontSize: 14,
              lineHeight: 22,
            }}
          >
            {wordChoice}
          </Text>
        </View>

        {/* STRENGTHS */}
        {strengths.length > 0 && (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: "800",
                marginBottom: 12,
              }}
            >
              STRENGTHS
            </Text>

            {strengths.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 9,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#60A5FA"
                  style={{ marginRight: 8 }}
                />

                <Text
                  style={{
                    flex: 1,
                    color: "#A1A1AA",
                    fontSize: 14,
                    lineHeight: 21,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* IMPROVEMENTS */}
        {improvements.length > 0 && (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 18,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: "800",
                marginBottom: 12,
              }}
            >
              IMPROVEMENTS
            </Text>

            {improvements.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 9,
                }}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={18}
                  color="#60A5FA"
                  style={{ marginRight: 8 }}
                />

                <Text
                  style={{
                    flex: 1,
                    color: "#A1A1AA",
                    fontSize: 14,
                    lineHeight: 21,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Button
          title={
            loading
              ? "Loading..."
              : questionNumber < totalQuestions
                ? "Continue"
                : "View Session Results"
          }
          onPress={handleContinue}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

export default AnswerFeedback;
