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

import getUserHandler from "../handlers/user/getUserHandler";

const Home = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserHandler();
      setUser(userData);
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.userName}>{user?.fullName}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileCircle}>
              <Ionicons name="person" size={28} color="#F8FAFC" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.employmentReadinessCard}>
          <Text
            style={{
              color: "#71717A",
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            EMPLOYMENT READINESS
          </Text>
          <View style={styles.line}>
            <View style={[styles.percent, { width: "95%" }]} />
          </View>
          <Text style={{ color: "#71717A", fontSize: 13, marginTop: 10 }}>
            Your ready for a job
          </Text>
        </View>

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 20,
            fontWeight: "700",
            marginTop: 10,
          }}
        >
          Quick Actions
        </Text>

        <View style={styles.quickActionsCard}>
          <TouchableOpacity
            style={styles.cardAction}
            onPress={() => navigation.navigate("Resume")}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="document-text-outline"
                color="#F8FAFC"
                size={24}
              />
            </View>

            <Text style={styles.cardActionText}>Build Resume</Text>
            <Text style={styles.cardActionSubtext}>Create your resume</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardAction, styles.primaryCard]}
            onPress={() => navigation.navigate("Interview")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <Ionicons name="mic-outline" color="#F8FAFC" size={24} />
            </View>

            <Text style={styles.cardActionText}>Mock Interview</Text>
            <Text style={styles.cardActionSubtext}>Practice your skills</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
};

export default Home;
