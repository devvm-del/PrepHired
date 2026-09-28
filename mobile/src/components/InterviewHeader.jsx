import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "../styles/global";

const InterviewHeader = ({
  navigation,
  interviewLabel,
  navigateTo,
  mockInterviewId,
  questionNumber,
  style,
  showTimer = true,

  // Choose: "back" or "exit"
  backIcon = "back",
}) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!showTimer) {
      return;
    }

    setTimeLeft(60);
  }, [questionNumber, showTimer]);

  useEffect(() => {
    if (!showTimer || timeLeft <= 0) {
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
  }, [timeLeft, showTimer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(
      2,
      "0",
    )}`;
  };

  const handleBack = () => {
    if (!navigateTo) {
      return;
    }

    navigation.navigate(navigateTo, {
      mockInterviewId,
    });
  };

  const iconName =
    backIcon === "exit"
      ? "exit-outline"
      : "arrow-back";

  return (
    <View
      style={[
        styles.header,
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
      >
        <Ionicons
          name={iconName}
          size={28}
          color="#F8FAFC"
        />
      </TouchableOpacity>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 15,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "700",
            fontSize: 20,
          }}
        >
          {interviewLabel}
        </Text>
      </View>

      {showTimer && (
        <View
          style={{
            borderWidth: 2,
            borderColor:
              timeLeft <= 10
                ? "#DC2626"
                : "#2563EB",

            width: 60,

            paddingVertical: 5,

            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color:
                timeLeft <= 10
                  ? "#DC2626"
                  : "#F8FAFC",

              fontWeight: "600",

              textAlign: "center",
            }}
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default InterviewHeader;
