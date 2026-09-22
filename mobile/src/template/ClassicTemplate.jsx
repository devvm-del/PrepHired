import React from "react";
import { View, Text } from "react-native";

const ClassicTemplate = ({ resume, preview = false }) => {
  const scale = preview ? 0.42 : 1;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        width: 350,
        minHeight: 842,
        padding: 40,
        transform: [{ scale }],
        transformOrigin: "top left",
      }}
    >
      {/* HEADER */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {resume?.basicInfo?.fullName || "Your Name"}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#4B5563",
          marginTop: 5,
        }}
      >
        {resume?.targetJob?.jobTitle || "Professional Title"}
      </Text>

      <Text
        style={{
          fontSize: 9,
          color: "#6B7280",
          marginTop: 10,
        }}
      >
        {resume?.basicInfo?.email || ""}
        {"  |  "}
        {resume?.basicInfo?.contactNumber || ""}
        {"  |  "}
        {resume?.basicInfo?.address || ""}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: "#111827",
          marginTop: 15,
          marginBottom: 20,
        }}
      />

      {/* SUMMARY */}
      {resume?.professionalSummary ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            PROFESSIONAL SUMMARY
          </Text>

          <Text
            style={{
              fontSize: 9,
              lineHeight: 14,
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
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            WORK EXPERIENCE
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
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {experience.jobTitle}
                  </Text>

                  <Text
                    style={{
                      fontSize: 9,
                      color: "#4B5563",
                      marginTop: 2,
                    }}
                  >
                    {experience.company}
                  </Text>
                </View>

                <View
                  style={{
                    width: 150,
                    alignItems: "flex-end",
                  }}
                >
                  {experience.location ? (
                    <Text
                      style={{
                        fontSize: 8,
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
                        fontSize: 8,
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
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            EDUCATION
          </Text>

          {resume.educations.map((education, index) => (
            <View key={education._id || index} style={{ marginBottom: 10 }}>
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
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {education.degreeField}
                  </Text>

                  <Text
                    style={{
                      fontSize: 9,
                      color: "#374151",
                      marginTop: 2,
                    }}
                  >
                    {education.school}
                  </Text>
                </View>

                <View
                  style={{
                    width: 150,
                    alignItems: "flex-end",
                  }}
                >
                  {education.location ? (
                    <Text
                      style={{
                        fontSize: 8,
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
                        fontSize: 8,
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

              {education.description ? (
                <Text
                  style={{
                    fontSize: 8,
                    color: "#374151",
                    lineHeight: 12,
                    marginTop: 4,
                  }}
                >
                  {education.description}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* SKILLS */}
      {resume?.skills ? (
        <View style={{ marginBottom: 18 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            SKILLS
          </Text>

          <Text
            style={{
              fontSize: 9,
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
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            PROJECTS
          </Text>

          {resume.projects.map((project, index) => (
            <View key={project._id || index} style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 10,
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
              fontSize: 12,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            CERTIFICATIONS
          </Text>

          <Text
            style={{
              fontSize: 9,
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

export default ClassicTemplate;
