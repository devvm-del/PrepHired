import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import styles from "../styles/global";

const Progress = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: "#F8FAFC", fontWeight: "700", fontSize: 22 }}>
          Progress Dashboard
        </Text>
      </ScrollView>

      <BottomNav active="progress" />
    </View>
  );
};

export default Progress;
