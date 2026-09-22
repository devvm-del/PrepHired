import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import IconTextInput from "../../components/IconTextInput";
import InterviewHeader from "../../components/InterviewHeader";
import Button from "../../components/Button";
import styles from "../../styles/global";
import { Ionicons } from "@expo/vector-icons";

const ReviewAnswer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InterviewHeader
          navigation={navigation}
          interviewLabel="Review Answers"
          navigateTo="SessionCompleted"
          showTimer={false}
        />

        <View
          style={{
            backgroundColor: "#25252F",
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            marginTop: 20,
          }}
        ></View>
        <View
          style={{
            backgroundColor: "#25252F",
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            marginTop: 20,
          }}
        ></View>
        <View
          style={{
            backgroundColor: "#25252F",
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            marginTop: 20,
          }}
        ></View>
        <View
          style={{
            backgroundColor: "#25252F",
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            marginTop: 20,
          }}
        ></View>
      </ScrollView>
    </View>
  );
};

export default ReviewAnswer;
