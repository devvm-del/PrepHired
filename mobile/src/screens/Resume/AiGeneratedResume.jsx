import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import ResumeHeader from "../../components/ResumeHeader";
import Button from "../../components/Button";
import AppModal from "../../components/AppModal";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../styles/global";

import useResume from "../../hooks/useResume";

const AiGeneratedResume = ({ navigation }) => {
  const route = useRoute();

  const { resumeId } = route.params;

  const { getById, loading } = useResume();

  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState("optimized");

  const [error, setError] = useState("");

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setError("");

      const result = await getById(resumeId);

      if (!result.success || !result.resume) {
        setError(result.message || "Unable to load resume");
        return;
      }

      setResume(result.resume);
    } catch (error) {
      console.log("Load AI generated resume error:", error);

      setError("Unable to load AI generated resume");
    }
  };

  const optimization = resume?.aiOptimization;

  const originalAnalysis = resume?.aiAnalysis;

  const optimizedAnalysis = optimization?.optimizedAnalysis || {};

  const originalScore = originalAnalysis?.atsScore || 0;

  const optimizedScore = optimizedAnalysis?.atsScore ?? originalScore;

  const scoreImprovement = optimizedScore - originalScore;

  const originalSummary = optimization?.professionalSummary?.original || "";

  const optimizedSummary =
    optimization?.professionalSummary?.optimized ||
    resume?.professionalSummary ||
    "";

  const originalSkills = optimization?.skills?.original || "";

  const optimizedSkills =
    optimization?.skills?.optimized || resume?.skills || "";

  const originalCertificates = optimization?.certificates?.original || "";

  const optimizedCertificates =
    optimization?.certificates?.optimized || resume?.certificates || "";

  const renderSectionTitle = (title, icon) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
          marginTop: 15,
        }}
      >
        <Ionicons name={icon} size={17} color="#60A5FA" />

        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 14,
            fontWeight: "700",
            marginLeft: 7,
          }}
        >
          {title}
        </Text>
      </View>
    );
  };

  const renderText = (value, emptyText = "No information") => {
    return (
      <Text
        style={{
          color: value ? "#D4D4D8" : "#71717A",
          fontSize: 13,
          lineHeight: 20,
        }}
      >
        {value || emptyText}
      </Text>
    );
  };

  const renderExperience = () => {
    const experiences =
      activeTab === "original"
        ? optimization?.workExperiences || []
        : resume?.workExperiences || [];

    if (!experiences.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No work experience added.
        </Text>
      );
    }

    return experiences.map((experience, index) => {
      const optimizedExperience = optimization?.workExperiences?.find(
        (item) => String(item.id) === String(experience._id),
      );

      let description = "";

      if (activeTab === "original") {
        description = experience.original || "";
      } else {
        description =
          optimizedExperience?.optimized || experience.description || "";
      }

      return (
        <View
          key={experience._id || experience.id || index}
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth: index !== experiences.length - 1 ? 1 : 0,
            borderBottomColor: "#3F3F4A",
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {experience.jobTitle || "Untitled Position"}
          </Text>

          <Text
            style={{
              color: "#60A5FA",
              fontSize: 12,
              fontWeight: "600",
              marginTop: 3,
            }}
          >
            {experience.company || "Company not specified"}
          </Text>

          {experience.location ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {experience.location}
            </Text>
          ) : null}

          <View style={{ marginTop: 8 }}>{renderText(description)}</View>
        </View>
      );
    });
  };

  const renderEducation = () => {
    const educations =
      activeTab === "original"
        ? resume?.educations || []
        : optimization?.educations || [];

    if (!educations.length) {
      return (
        <Text
          style={{
            color: "#71717A",
            fontSize: 13,
          }}
        >
          No education added.
        </Text>
      );
    }

    return educations.map((education, index) => {
      const degreeField =
        activeTab === "original"
          ? education.degreeField || ""
          : education.degreeField?.optimized || education.degreeField || "";

      const school =
        activeTab === "original"
          ? education.school || ""
          : education.school?.optimized || education.school || "";

      const location =
        activeTab === "original"
          ? education.location || ""
          : education.location?.optimized || education.location || "";

      const description =
        activeTab === "original"
          ? education.description || ""
          : education.optimized?.optimized || "";

      return (
        <View
          key={education._id || education.id || index}
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth: index !== educations.length - 1 ? 1 : 0,
            borderBottomColor: "#3F3F4A",
          }}
        >
          <Text
            style={{
              color: "#F8FAFC",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {degreeField || "Degree / Field"}
          </Text>

          <Text
            style={{
              color: "#60A5FA",
              fontSize: 12,
              fontWeight: "600",
              marginTop: 3,
            }}
          >
            {school || "School not specified"}
          </Text>

          {location ? (
            <Text
              style={{
                color: "#71717A",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {location}
            </Text>
          ) : null}

          {description ? (
            <View style={{ marginTop: 8 }}>{renderText(description)}</View>
          ) : null}
        </View>
      );
    });
  };

  const renderProjects = () => {
    const projects =
      activeTab === "original"
        ? resume?.projects || []
        : optimization?.projects || [];

    
      if (!projects.length) {
        return (
          <Text
            style={{
              color: "#71717A",
              fontSize: 13,
            }}
          >
            No projects added.
          </Text>
        );
      }
    const validProjects = projects.filter((project) => {
      if (activeTab === "original") {
        return (
          project?.projectName?.trim() ||
          project?.projectDescription?.trim()
        );
      }

      const optimizedProject = project;

      return (
        optimizedProject?.projectName?.optimized?.trim() ||
        optimizedProject?.projectName?.trim() ||
        optimizedProject?.optimized?.trim()
      );
    });

    if (!validProjects.length) {
      return null;
    }

    return validProjects.map((project, index) => {
      const optimizedProject =
        optimization?.projects?.find(
          (item) => String(item.id) === String(project._id)
        );

      let projectName = "";
      let description = "";

      if (activeTab === "original") {
        projectName = project.projectName?.trim() || "";
        description = project.projectDescription?.trim() || "";
      } else {
        projectName =
          optimizedProject?.projectName?.optimized?.trim() ||
          optimizedProject?.projectName?.trim() ||
          project.projectName?.trim() ||
          "";

        description =
          optimizedProject?.optimized?.trim() ||
          project.projectDescription?.trim() ||
          "";
      }

      // Don't render an empty project.
      if (!projectName && !description) {
        return null;
      }

      return (
        <View
          key={project._id || project.id || index}
          style={{
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth:
              index !== validProjects.length - 1 ? 1 : 0,
            borderBottomColor: "#3F3F4A",
          }}
        >
          {projectName ? (
            <Text
              style={{
                color: "#F8FAFC",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {projectName}
            </Text>
          ) : null}

          {description ? (
            <View style={{ marginTop: 8 }}>
              {renderText(description)}
            </View>
          ) : null}
        </View>
      );
    });
  };

  const changes = optimization?.changes || [];

  const renderChangeReasons = () => {
    const reasons = [];

    if (optimization?.professionalSummary?.reason) {
      reasons.push({
        title: "Professional Summary",
        reason: optimization.professionalSummary.reason,
        icon: "document-text-outline",
      });
    }

    if (optimization?.skills?.reason) {
      reasons.push({
        title: "Skills",
        reason: optimization.skills.reason,
        icon: "sparkles-outline",
      });
    }

    if (
      optimization?.certificates?.reason &&
      (
        optimization?.certificates?.original?.trim() ||
        optimization?.certificates?.optimized?.trim() ||
        resume?.certificates?.trim()
      )
    ) {
      reasons.push({
        title: "Certificates",
        reason: optimization.certificates.reason,
        icon: "ribbon-outline",
      });
    }

    (optimization?.workExperiences || []).forEach((experience) => {
      if (experience.reason) {
        reasons.push({
          title: experience.jobTitle || "Work Experience",
          reason: experience.reason,
          icon: "briefcase-outline",
        });
      }
    });

    (optimization?.educations || []).forEach((education) => {
      if (education.reason) {
        reasons.push({
          title: education.degreeField || "Education",
          reason: education.reason,
          icon: "school-outline",
        });
      }
    });

    (optimization?.projects || []).forEach((project) => {
      if (project.reason) {
        reasons.push({
          title: project.projectName || "Project",
          reason: project.reason,
          icon: "folder-outline",
        });
      }
    });

    return reasons;
  };

  const reasonItems = renderChangeReasons();

  const handleChooseTemplate = () => {
    navigation.navigate("ChooseTemplate", {
      resumeId,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumeHeader
          navigation={navigation}
          resumeLabel="AI Generated Resume"
          resumeId={resumeId}
          navigateTo="SummaryExtras"
        />

        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          6/8
        </Text>

        <View
          style={{
            backgroundColor: "#25252F",
            width: "100%",
            height: 8,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View
            style={[
              styles.percent,
              {
                width: "75%",
              },
            ]}
          />
        </View>

        <Text
          style={{
            color: "#A1A1AA",
            fontSize: 13,
            fontWeight: "500",
            marginBottom: 15,
          }}
        >
          Review your AI-optimized resume and see what changed.
        </Text>

        {/* ========================================
            ATS SCORE
        ======================================== */}

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: "#A1A1AA",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                ATS SCORE
              </Text>

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 28,
                  fontWeight: "800",
                  marginTop: 3,
                }}
              >
                {optimizedScore}
                <Text
                  style={{
                    color: "#71717A",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  /100
                </Text>
              </Text>
            </View>

            {scoreImprovement !== 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: scoreImprovement > 0 ? "#173B2A" : "#3A2528",
                  borderRadius: 14,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <Ionicons
                  name={
                    scoreImprovement > 0
                      ? "trending-up-outline"
                      : "trending-down-outline"
                  }
                  size={15}
                  color={scoreImprovement > 0 ? "#4ADE80" : "#F87171"}
                />

                <Text
                  style={{
                    color: scoreImprovement > 0 ? "#4ADE80" : "#F87171",
                    fontSize: 12,
                    fontWeight: "700",
                    marginLeft: 4,
                  }}
                >
                  {scoreImprovement > 0 ? "+" : ""}
                  {scoreImprovement}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                }}
              >
                Original
              </Text>

              <Text
                style={{
                  color: "#D4D4D8",
                  fontSize: 14,
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                {originalScore}/100
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#71717A",
                  fontSize: 11,
                }}
              >
                AI Optimized
              </Text>

              <Text
                style={{
                  color: "#60A5FA",
                  fontSize: 14,
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                {optimizedScore}/100
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("original")}
            activeOpacity={0.7}
            style={{
              width: "48%",
            }}
          >
            <View
              style={{
                height: 36,
                backgroundColor:
                  activeTab === "original" ? "#2563EB" : "#25252F",
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: activeTab === "original" ? 0 : 1,
                borderColor: "#2563EB",
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                Original
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("optimized")}
            activeOpacity={0.7}
            style={{
              width: "48%",
            }}
          >
            <View
              style={{
                height: 36,
                backgroundColor:
                  activeTab === "optimized" ? "#2563EB" : "#25252F",
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: activeTab === "optimized" ? 0 : 1,
                borderColor: "#2563EB",
              }}
            >
              <Text
                style={{
                  color: "#F8FAFC",
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                AI Optimized
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#25252F",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          {/* SUMMARY */}

          {renderSectionTitle("Professional Summary", "document-text-outline")}

          {renderText(
            activeTab === "original" ? originalSummary : optimizedSummary,
          )}

          {/* WORK EXPERIENCE */}

          {renderSectionTitle("Work Experience", "briefcase-outline")}

          {renderExperience()}

          {/* EDUCATION */}

          {renderSectionTitle("Education", "school-outline")}

          {renderEducation()}

          {/* SKILLS */}

          {renderSectionTitle("Skills", "sparkles-outline")}

          {renderText(
            activeTab === "original" ? originalSkills : optimizedSkills,
          )}

          {/* PROJECTS */}

          {renderSectionTitle("Projects", "folder-outline")}

          {renderProjects()}

          {/* CERTIFICATES */}

          {renderSectionTitle("Certificates / Licenses", "ribbon-outline")}

          {renderText(
            activeTab === "original"
              ? originalCertificates
              : optimizedCertificates,
          )}
        </View>

        <Text
          style={{
            color: "#F8FAFC",
            fontWeight: "700",
            fontSize: 15,
            marginBottom: 15,
          }}
        >
          What changed & Why
        </Text>

        {/* MAJOR CHANGES */}

        {changes.length > 0 ? (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons name="sparkles-outline" size={18} color="#60A5FA" />

              <Text
                style={{
                  color: "#F8FAFC",
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 7,
                }}
              >
                Major Improvements
              </Text>
            </View>

            {changes.map((change, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: index !== changes.length - 1 ? 10 : 0,
                }}
              >
                <Text
                  style={{
                    color: "#60A5FA",
                    fontSize: 13,
                    marginRight: 8,
                  }}
                >
                  •
                </Text>

                <Text
                  style={{
                    flex: 1,
                    color: "#D4D4D8",
                    fontSize: 13,
                    lineHeight: 19,
                  }}
                >
                  {change}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {reasonItems.length > 0 ? (
          reasonItems.map((item, index) => (
            <View
              key={`${item.title}-${index}`}
              style={{
                backgroundColor: "#25252F",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name={item.icon} size={17} color="#60A5FA" />

                <Text
                  style={{
                    color: "#F8FAFC",
                    fontSize: 13,
                    fontWeight: "700",
                    marginLeft: 7,
                  }}
                >
                  {item.title}
                </Text>
              </View>

              <Text
                style={{
                  color: "#A1A1AA",
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {item.reason}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={{
              backgroundColor: "#25252F",
              borderRadius: 16,
              padding: 16,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                color: "#A1A1AA",
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              No major changes were necessary. Your resume was already well
              aligned with the target position.
            </Text>
          </View>
        )}
      </ScrollView>

      <Button
        style={{
          marginBottom: 65,
        }}
        title="Choose Template"
        onPress={handleChooseTemplate}
      />
    </View>
  );
};

export default AiGeneratedResume;
