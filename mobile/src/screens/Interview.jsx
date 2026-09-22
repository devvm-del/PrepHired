import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import IconTextInput from "../components/IconTextInput";
import BottomNav from "../components/BottomNav";
import Button from "../components/Button";
import styles from "../styles/global";

const Interview = () => {
  const navigation = useNavigation();

  const [targetJob, setTargetJob] = useState("");
  const [targetJobError, setTargetJobError] = useState("");

  const [selectedInterviewCategory, setSelectedInterviewCategory] =
    useState("All");

  const [selectedResponseMode, setSelectedResponseMode] = useState("Text");

  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] =
    useState("5");

  const interviewCategories = [
    "Behavioral",
    "Technical",
    "HR Screening",
    "All",
  ];

  const responseModeCategory = ["Text", "Audio"];

  const numberOfQuestionsCategories = ["5", "8", "12"];

  const handleStartInterview = () => {
    if (!targetJob.trim()) {
      setTargetJobError("Please enter the role you are targeting.");
      return;
    }

    navigation.navigate("QuestionAndAnswer", {
      targetJob: targetJob.trim(),
      interviewCategory: selectedInterviewCategory,
      responseMode: selectedResponseMode,
      numberOfQuestions: selectedNumberOfQuestions,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 20,
          }}
        >
          AI Mock Interview
        </Text>

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 5,
          }}
        >
          What role are you targeting?
        </Text>

        <IconTextInput
          style={{
            height: 55,
            marginTop: -20,
          }}
          icon="person-outline"
          placeholder="eg. Software Developer"
          value={targetJob}
          onChangeText={(text) => {
            setTargetJob(text);
            setTargetJobError("");
          }}
          keyboardType="default"
          error={targetJobError}
        />

        {targetJobError ? (
          <Text style={styles.textError}>{targetJobError}</Text>
        ) : null}

        {/* Interview Category */}
        <Text
          style={{
            color: "#71717A",
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          INTERVIEW CATEGORY
        </Text>

        <View style={styles.interviewCategoryContainer}>
          {interviewCategories.map((category) => {
            const selected = selectedInterviewCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.interviewCategoryChip,
                  selected && styles.interviewCategorySelected,
                ]}
                onPress={() => setSelectedInterviewCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.interviewCategoryText,
                    selected && styles.interviewCategoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Response Mode */}
        <Text
          style={{
            color: "#71717A",
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          RESPONSE MODE
        </Text>

        <View style={styles.interviewCategoryContainer}>
          {responseModeCategory.map((responseMode) => {
            const selected = selectedResponseMode === responseMode;

            return (
              <TouchableOpacity
                key={responseMode}
                style={[
                  styles.responseModeChip,
                  selected && styles.responseModeSelected,
                ]}
                onPress={() => setSelectedResponseMode(responseMode)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.interviewCategoryText,
                    selected && styles.interviewCategoryTextSelected,
                  ]}
                >
                  {responseMode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text
          style={{
            color: "#71717A",
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          NUMBER OF QUESTIONS
        </Text>

        <View style={styles.interviewCategoryContainer}>
          {numberOfQuestionsCategories.map((numberOfQuestions) => {
            const selected = selectedNumberOfQuestions === numberOfQuestions;

            return (
              <TouchableOpacity
                key={numberOfQuestions}
                style={[
                  styles.numberOfQuestionChip,
                  selected && styles.numberOfQuestionsSelected,
                ]}
                onPress={() => setSelectedNumberOfQuestions(numberOfQuestions)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.interviewCategoryText,
                    selected && styles.interviewCategoryTextSelected,
                  ]}
                >
                  {numberOfQuestions}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button title="Start Interview" onPress={handleStartInterview} />
      </ScrollView>

      <BottomNav active="interview" />
    </View>
  );
};

export default Interview;
