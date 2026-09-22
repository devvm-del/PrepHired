import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import IconTextInput from "../../components/IconTextInput";
import Button from "../../components/Button";
import styles from "../../styles/global";

const AnswerFeedback = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 30,
          }}
        >
          Answer Feedback
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#2563EB",
              width: 110,
              paddingVertical: 15,
              alignItems: "center",
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#F8FAFC", fontWeight: "500" }}>78%</Text>
            <Text style={{ color: "#71717A", fontSize: 12, fontWeight: "700" }}>
              CONTENT
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#2563EB",
              width: 110,
              paddingVertical: 15,
              alignItems: "center",
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#F8FAFC", fontWeight: "500" }}>78%</Text>
            <Text style={{ color: "#71717A", fontSize: 12, fontWeight: "700" }}>
              CONFIDENCE
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#2563EB",
              width: 110,
              paddingVertical: 15,
              alignItems: "center",
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#F8FAFC", fontWeight: "500" }}>78%</Text>
            <Text style={{ color: "#71717A", fontSize: 12, fontWeight: "700" }}>
              NATURAL
            </Text>
          </View>
        </View>

        {/* Interview Category */}
        <Text
          style={{
            color: "#71717A",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          TONE & MODULATION
        </Text>

        {/* Interview Category */}
        <Text
          style={{
            color: "#71717A",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          WORD CHOICE SUGGESTIONS
        </Text>

        <Button style={{ marginBottom: 15 }} title="Continue" />
      </ScrollView>
    </View>
  );
};

export default AnswerFeedback;
