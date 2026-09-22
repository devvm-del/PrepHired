import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/global";

const InterviewHeader = ({
  navigation,
  interviewLabel,
  navigateTo,
  questionNumber,
  style,
  showTimer = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);

  // Reset timer whenever questionNumber changes
  useEffect(() => {
    if (!showTimer) return;

    setTimeLeft(60);
  }, [questionNumber, showTimer]);

  // Countdown
  useEffect(() => {
    if (!showTimer || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showTimer]);

  // Format timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  return (
    <View style={[styles.header, style]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <Ionicons name="arrow-back-outline" size={28} color="#F8FAFC" />
      </TouchableOpacity>

      {/* Interview Label */}
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

      {/* Timer */}
      {showTimer && (
        <View
          style={{
            borderWidth: 2,
            borderColor: timeLeft <= 10 ? "#DC2626" : "#2563EB",
            width: 60,
            paddingVertical: 5,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: timeLeft <= 10 ? "#DC2626" : "#F8FAFC",
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
