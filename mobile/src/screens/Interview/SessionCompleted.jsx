import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import IconTextInput from "../../components/IconTextInput";
import Button from "../../components/Button";
import styles from "../../styles/global";
import { Ionicons } from "@expo/vector-icons";

const SessionCompleted = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#2563EB",
              padding: 30,
              borderRadius: 60,
            }}
          >
            <Ionicons name="checkmark-outline" color="#F8FAFC" size={55} />
          </View>
          <Text
            style={{
              color: "#F8FAFC",
              fontWeight: "700",
              fontSize: 20,
              marginTop: 15,
            }}
          >
            Session Completed
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#25252F",
            height: 140,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#71717A",
              fontSize: 15,
              fontWeight: "700",
              marginBottom: 5,
            }}
          >
            OVERALL SCORE
          </Text>
          <Text style={{ color: "#F8FAFC", fontWeight: "bold", fontSize: 35 }}>
            78%
          </Text>
        </View>

        <Text
          style={{
            color: "#71717A",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          SKILL BREAKDOWN
        </Text>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Button
          style={{
            marginBottom: 65,
            width: "48%",
            backgroundColor: "#15151B",
            borderWidth: 2,
            borderColor: "#2563EB",
          }}
          onPress={() => navigation.navigate("ReviewAnswer")}
          title="Review Answer"
        />

        <Button
          style={{
            marginBottom: 15,
            width: "48%",
          }}
          onPress={() => navigation.navigate("Home")}
          title="Done"
        />
      </View>
    </View>
  );
};

export default SessionCompleted;
