import React from "react";
import { View, Text } from "react-native";

const MinimalTemplate = ({ resume, preview = false }) => {
  const scale = preview ? 0.42 : 1;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        width: 350,
        minHeight: 842,
        padding: 45,
        transform: [{ scale }],
        transformOrigin: "top left",
      }}
    >
      {/* HEADER */}
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {resume?.basicInfo?.fullName || "Your Name"}
      </Text>

      <Text
        style={{
          fontSize: 11,
          color: "#6B7280",
          marginTop: 4,
        }}
      >
        {resume?.targetJob?.jobTitle || "Professional Title"}
      </Text>

      <Text
        style={{
          fontSize: 8,
          color: "#6B7280",
          marginTop: 8,
        }}
      >
        {resume?.basicInfo?.email || ""}
        {"  •  "}
        {resume?.basicInfo?.contactNumber || ""}
        {"  •  "}
        {resume?.basicInfo?.address || ""}
      </Text>

      {/* SUMMARY */}
      {resume?.professionalSummary ? (
        <View style={{ marginTop: 25, marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 5,
            }}
          >
            SUMMARY
          </Text>

          <Text
            style={{
              fontSize: 8.5,
              lineHeight: 13,
              color: "#374151",
            }}
          >
            {resume.professionalSummary}
          </Text>
        </View>
      ) : null}

      {/* EXPERIENCE */}
      {resume?.workExperiences?.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            EXPERIENCE
          </Text>

          {resume.workExperiences.map((experience, index) => (
            <View key={experience._id || index} style={{ marginBottom: 11 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {experience.jobTitle}
                  </Text>

                  <Text
                    style={{
                      fontSize: 8,
                      color: "#4B5563",
                      marginTop: 2,
                    }}
                  >
                    {experience.company}
                  </Text>
                </View>

                <View
                  style={{
                    width: 145,
                    alignItems: "flex-end",
                  }}
                >
                  {experience.location ? (
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {experience.location}
                    </Text>
                  ) : null}

                  {experience.periodOfEmployment ? (
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: "#6B7280",
                        textAlign: "right",
                        marginTop: 2,
                      }}
                    >
                      {experience.periodOfEmployment}
                    </Text>
                  ) : null}
                </View>
              </View>

              {experience.description ? (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 12,
                    marginTop: 4,
                  }}
                >
                  {experience.description}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* EDUCATION */}
      {resume?.educations?.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            EDUCATION
          </Text>

          {resume.educations.map((education, index) => (
            <View key={education._id || index} style={{ marginBottom: 9 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {education.degreeField}
                  </Text>

                  <Text
                    style={{
                      fontSize: 8,
                      color: "#4B5563",
                      marginTop: 2,
                    }}
                  >
                    {education.school}
                  </Text>
                </View>

                <View
                  style={{
                    width: 145,
                    alignItems: "flex-end",
                  }}
                >
                  {education.location ? (
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: "#6B7280",
                        textAlign: "right",
                      }}
                    >
                      {education.location}
                    </Text>
                  ) : null}

                  {education.schoolYear ? (
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: "#6B7280",
                        textAlign: "right",
                        marginTop: 2,
                      }}
                    >
                      {education.schoolYear}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* SKILLS */}
      {resume?.skills ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 5,
            }}
          >
            SKILLS
          </Text>

          <Text
            style={{
              fontSize: 8.5,
              color: "#374151",
              lineHeight: 13,
            }}
          >
            {resume.skills}
          </Text>
        </View>
      ) : null}

      {/* PROJECTS */}
      {resume?.projects?.length > 0 ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 7,
            }}
          >
            PROJECTS
          </Text>

          {resume.projects.map((project, index) => (
            <View key={project._id || index} style={{ marginBottom: 9 }}>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {project.projectName}
              </Text>

              <Text
                style={{
                  fontSize: 8,
                  color: "#374151",
                  lineHeight: 12,
                  marginTop: 3,
                }}
              >
                {project.projectDescription}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* CERTIFICATIONS */}
      {resume?.certificates ? (
        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 5,
            }}
          >
            CERTIFICATIONS
          </Text>

          <Text
            style={{
              fontSize: 8.5,
              color: "#374151",
            }}
          >
            {resume.certificates}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default MinimalTemplate;
