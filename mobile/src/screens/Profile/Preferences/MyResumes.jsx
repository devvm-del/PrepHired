import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import ResumeHeader from "../../../components/ResumeHeader";
import ResumeTemplate from "../../../template/ResumeTemplate";
import styles from "../../../styles/global";

import useResume from "../../../hooks/useResume";

const MyResumes = () => {
  const navigation = useNavigation();

  const { getCompletedResumes, loading } = useResume();
  
  const [resumes, setResumes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCompletedResumes();
    }, []),
  );

  const loadCompletedResumes = async () => {
    const result = await getCompletedResumes();

    if (result.success) {
      setResumes(result.resumes);
    } else {
      console.log("Get completed resumes error:", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <ResumeHeader
          navigation={navigation}
          resumeLabel="My Resumes"
          navigateTo="Profile"
        />

         <View style={styles.myResumeCardContainer}>
          {loading ? (
            // LOADING SKELETON
            <>
              {[1, 2, 3, 4, 5, 6 ,7 ,8].map((item) => (
                <View
                  key={item}
                  style={[
                    styles.resumeCard,
                    {
                      width: "48%",
                      backgroundColor: "#25252F",
                    },
                  ]}
                >
                  <View style={styles.skeletonHeader} />

                  <View style={styles.skeletonLineLarge} />
                  <View style={styles.skeletonLine} />
                  <View style={styles.skeletonLine} />

                  <View style={styles.skeletonBody}>
                    <View style={styles.skeletonLine} />
                    <View style={styles.skeletonLine} />
                    <View style={styles.skeletonLine} />
                  </View>
                </View>
              ))}
            </>
          ) : resumes.length === 0 ? (
            // NO RESUMES paddingVertical: 70
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 30,
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={30}
                color="#A1A1AA"
              />
              <Text
                style={{
                  color: "#A1A1AA",
                  fontSize: 14,
                  fontWeight: "600",
                  marginTop: 5,
                }}
              >
                No resumes created yet
              </Text>
            </View>
          ) : (
            // RESUMES
            resumes.map((resume) => (
              <TouchableOpacity
                key={resume._id}
                style={[
                  styles.resumeCard,
                  {
                    width: "48%",
                  },
                ]}
                activeOpacity={0.8}
                
                onPress={() =>
                  navigation.navigate("CompletedResumePreviewProfile", {
                    resumeId: resume._id,
                  })
                }
                
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <ResumeTemplate resume={resume} template={resume.template} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

    </View>
  );
};

export default MyResumes;
