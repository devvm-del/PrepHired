const Resume = require("../models/resume");
const {
  generateProfessionalSummary,
  generateResumeAnalysis,
  optimizeResume: optimizeResumeAI,
} = require("../services/ai/aiService");

const { generateResumePDF } = require("../services/resumePdfService");

// CREATE DRAFT
const createResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const errors = {};

    if (!userId) {
      errors.userId = "User authentication is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const existingDraft = await Resume.findOne({
      userId,
      status: "draft",
    });

    if (existingDraft) {
      return res.status(200).json({
        success: true,
        message: "Draft resume already exists",
        resume: existingDraft,
        errors: {},
      });
    }

    const resume = await Resume.create({
      userId,
      status: "draft",
      currentStep: 1,
    });

    return res.status(201).json({
      success: true,
      message: "Draft resume created",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Create resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create resume",
      errors: {},
    });
  }
};

// GET DRAFT
const getDraftResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const errors = {};

    if (!userId) {
      errors.userId = "User authentication is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      userId,
      status: "draft",
    });

    return res.status(200).json({
      success: true,
      message: resume
        ? "Draft resume retrieved successfully"
        : "No draft resume found",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Get draft error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get draft resume",
      errors: {},
    });
  }
};

// GET RESUME
const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (!userId) {
      errors.userId = "User authentication is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume retrieved successfully",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get resume",
      errors: {},
    });
  }
};

// STEP 1 - BASIC INFO
const saveBasicInfo = async (req, res) => {
  try {
    const {
      fullName,
      contactNumber,
      address,
      email,
      linkedInURL,
      portfolioLink,
    } = req.body;

    const errors = {};

    // Required fields
    if (!fullName?.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!contactNumber?.trim()) {
      errors.contactNumber = "Contact number is required";
    }

    if (!address?.trim()) {
      errors.address = "Address is required";
    }

    if (!email?.trim()) {
      errors.email = "Email is required";
    }

    // Full name validation
    if (fullName?.trim() && fullName.trim() !== req.user.fullName) {
      errors.fullName = "Full name does not match your account";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email?.trim() && !emailRegex.test(email.trim())) {
      errors.email = "Invalid email format";
    }

    // Contact number validation
    const phoneRegex = /^09[0-9]{9}$/;

    if (contactNumber?.trim()) {
      const value = contactNumber.trim();

      if (value.length !== 11) {
        errors.contactNumber = "Contact number must be exactly 11 digits";
      } else if (!phoneRegex.test(value)) {
        errors.contactNumber = "Contact number must start with 09";
      }
    }

    // LinkedIn URL validation
    if (linkedInURL?.trim()) {
      try {
        const url = new URL(linkedInURL.trim());

        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error();
        }
      } catch {
        errors.linkedInURL = "Invalid LinkedIn URL";
      }
    }

    // Portfolio URL validation
    if (portfolioLink?.trim()) {
      try {
        const url = new URL(portfolioLink.trim());

        if (url.protocol !== "http:" && url.protocol !== "https:") {
          throw new Error();
        }
      } catch {
        errors.portfolioLink = "Invalid portfolio URL";
      }
    }

    // Return all validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          basicInfo: {
            fullName: fullName.trim(),
            contactNumber: contactNumber.trim(),
            address: address.trim(),
            email: email.trim().toLowerCase(),
            linkedInURL: linkedInURL?.trim() || "",
            portfolioLink: portfolioLink?.trim() || "",
          },
          currentStep: 2,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Basic information saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save basic info error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save basic information",
      errors: {},
    });
  }
};

// STEP 2 - TARGET JOB
const saveTargetJob = async (req, res) => {
  try {
    const { jobTitle, industry, jobDescription } = req.body;

    const errors = {};

    if (!jobTitle?.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!industry?.trim()) {
      errors.industry = "Industry is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          targetJob: {
            jobTitle: jobTitle.trim(),
            industry: industry.trim(),
            jobDescription: jobDescription.trim() || "",
          },
          currentStep: 3,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Target job saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save target job error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save target job",
      errors: {},
    });
  }
};

// STEP 3 - WORK EXPERIENCE
/*
const saveWorkExperience = async (req, res) => {
  try {
    const { workExperiences, noWorkExperience } = req.body;

    const errors = {};

    if (typeof noFormalWorkExperience !== "boolean") {
      errors.noFormalWorkExperience =
        "No formal work experience must be true or false";
    }

    // Validate workExperiences
    if (!Array.isArray(workExperiences)) {
      errors.workExperiences = "Work experiences must be an array";
    }

    if (!Array.isArray(workExperiences)) {
      errors.workExperiences = "Work experiences must be an array";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          workExperiences,
          currentStep: 4,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Work experience saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save work experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save work experience",
      errors: {},
    });
  }
};
*/
const saveWorkExperience = async (req, res) => {
  try {
    const { workExperiences, noWorkExperience } = req.body;

    const errors = {};

    // Validate noWorkExperience
    if (typeof noWorkExperience !== "boolean") {
      errors.noWorkExperience =
        "No formal work experience must be true or false";
    }

    // Validate workExperiences
    if (!Array.isArray(workExperiences)) {
      errors.workExperiences = "Work experiences must be an array";
    }

    // If checkbox is NOT checked,
    // work experience is required.
    if (noWorkExperience === false && Array.isArray(workExperiences)) {
      if (workExperiences.length === 0) {
        errors.workExperiences = "Please add at least one work experience.";
      }

      workExperiences.forEach((experience, index) => {
        if (!experience.jobTitle || !experience.jobTitle.trim()) {
          errors[`experience.${index}.jobTitle`] = "Job title is required";
        }

        if (!experience.company || !experience.company.trim()) {
          errors[`experience.${index}.company`] = "Company is required";
        }

        if (!experience.location || !experience.location.trim()) {
          errors[`experience.${index}.location`] = "Location is required";
        }

        if (
          !experience.periodOfEmployment ||
          !experience.periodOfEmployment.trim()
        ) {
          errors[`experience.${index}.periodOfEmployment`] =
            "Period of employment is required";
        }
      });
    }

    // Stop here if validation failed
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          noWorkExperience,

          workExperiences: noWorkExperience === true ? [] : workExperiences,

          currentStep: 4,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Work experience saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save work experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save work experience",
      errors: {},
    });
  }
};

// STEP 4 - EDUCATION
const saveEducation = async (req, res) => {
  try {
    const { educations } = req.body;

    const errors = {};

    if (!Array.isArray(educations)) {
      errors.educations = "Educations must be an array";
    } else {
      // =========================
      // VALIDATE EACH EDUCATION
      // =========================

      educations.forEach((education, index) => {
        // School
        if (!education?.school?.trim()) {
          errors[`educations.${index}.school`] = "School name is required";
        }

        // Degree / Field
        if (!education?.degreeField?.trim()) {
          errors[`educations.${index}.degreeField`] =
            "Degree/field is required";
        }

        // Location
        if (!education?.location?.trim()) {
          errors[`educations.${index}.location`] = "Location is required";
        }

        // School Year
        if (!education?.schoolYear?.trim()) {
          errors[`educations.${index}.schoolYear`] = "School year is required";
        }
      });
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          educations,
          currentStep: 5,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Education saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save education",
      errors: {},
    });
  }
};

// STEP 5 - SUMMARY & EXTRAS
const saveSummaryExtras = async (req, res) => {
  try {
    const { professionalSummary, skills, projects, certificates } = req.body;

    const errors = {};

    if (!professionalSummary?.trim()) {
      errors.professionalSummary = "Professional summary is required";
    }

    if (!skills?.trim()) {
      errors.skills = "Skills are required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Get the current resume first
    const currentResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: "draft",
    });

    if (!currentResume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    // Prepare new values
    const newProfessionalSummary = professionalSummary?.trim() || "";

    const newSkills = skills?.trim() || "";

    const newCertificates = certificates?.trim() || "";

    const newProjects = Array.isArray(projects) ? projects : [];

    // Compare old and new values
    const oldProfessionalSummary = currentResume.professionalSummary || "";

    const oldSkills = currentResume.skills || "";

    const oldCertificates = currentResume.certificates || "";

    const oldProjects = (currentResume.projects || []).map((project) => ({
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
    }));

    const cleanedNewProjects = newProjects.map((project) => ({
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
    }));

    const professionalSummaryChanged =
      oldProfessionalSummary !== newProfessionalSummary;

    const skillsChanged = oldSkills !== newSkills;

    const certificatesChanged = oldCertificates !== newCertificates;

    const projectsChanged =
      JSON.stringify(oldProjects) !== JSON.stringify(cleanedNewProjects);

    const contentChanged =
      professionalSummaryChanged ||
      skillsChanged ||
      certificatesChanged ||
      projectsChanged;

    const updateData = {
      currentStep: 6,
      professionalSummary: newProfessionalSummary,
      skills: newSkills,
      certificates: newCertificates,
      projects: newProjects,
    };

    // IMPORTANT:
    // If the resume content changed, the previous AI
    // optimization is no longer valid.
    if (contentChanged) {
      updateData.aiOptimization = null;
      updateData.aiAnalysis = null;
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Summary and extras saved",
      contentChanged,
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save summary extras error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save summary and extras",
      errors: {},
    });
  }
};

// STEP 7 - CHOOSE TEMPLATE
const saveTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { template } = req.body;

    const errors = {};

    const allowedTemplates = ["classic", "modern", "professional", "minimal"];

    // Validate template
    if (!template || typeof template !== "string") {
      errors.template = "Template is required";
    } else {
      const selectedTemplate = template.trim().toLowerCase();

      if (!allowedTemplates.includes(selectedTemplate)) {
        errors.template = "Invalid template";
      }
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const selectedTemplate = template.trim().toLowerCase();

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          template: selectedTemplate,
          currentStep: 7,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume template saved",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Save template error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save resume template",
      errors: {},
    });
  }
};

// COMPLETE RESUME
const completeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
        status: "draft",
      },
      {
        $set: {
          status: "completed",
          currentStep: 8,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume saved successfully.",
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Complete resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete resume",
      errors: {},
    });
  }
};

// AI - GENERATE PROFESSIONAL SUMMARY
const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
      status: "draft",
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    const summary = await generateProfessionalSummary(resume);

    resume.professionalSummary = summary;

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Professional summary generated successfully",
      summary,
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Generate summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate professional summary",
      errors: {},
    });
  }
};

// AI -ANALYZE RESUME
const analyzeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
      status: "draft",
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    const analysis = await generateResumeAnalysis(resume);

    resume.aiAnalysis = {
      ...analysis,
      generatedAt: new Date(),
    };

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis: resume.aiAnalysis,
      resume,
      errors: {},
    });
  } catch (error) {
    console.error("Analyze resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      errors: {},
    });
  }
};

// AI - OPTIMIZE RESUME
const optimizeResume = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Resume ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
      status: "draft",
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Draft resume not found",
        errors: {},
      });
    }

    const originalAnalysis = await generateResumeAnalysis(resume);

    if (!originalAnalysis || typeof originalAnalysis.atsScore !== "number") {
      return res.status(500).json({
        success: false,
        message: "AI did not return a valid original ATS score",
        errors: {},
      });
    }

    console.log("Original ATS Score:", originalAnalysis.atsScore);

    // Save original analysis
    resume.aiAnalysis = {
      ...originalAnalysis,
      generatedAt: new Date(),
    };

    await resume.save();

    const optimization = await optimizeResumeAI(resume);

    if (!optimization || typeof optimization !== "object") {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid optimization",
        errors: {},
      });
    }

    resume.aiOptimization = {
      address: optimization.address || {
        original: resume.basicInfo.address || "",
        optimized: resume.basicInfo.address || "",
        reason: "No address change was necessary.",
      },

      professionalSummary: optimization.professionalSummary || {
        original: resume.professionalSummary || "",
        optimized: resume.professionalSummary || "",
        reason: "No professional summary change was necessary.",
      },

      workExperiences: optimization.workExperiences || [],

      educations: optimization.educations || [],

      skills: optimization.skills || {
        original: resume.skills || "",
        optimized: resume.skills || "",
        reason: "No skills change was necessary.",
      },

      projects: optimization.projects || [],

      certificates: optimization.certificates || {
        original: resume.certificates || "",
        optimized: resume.certificates || "",
        reason: "No certificate change was necessary.",
      },

      changes: optimization.changes || [],

      generatedAt: new Date(),
    };

    // OPTIMIZED BASIC INFO ADDRESS
    if (optimization.address?.optimized !== undefined) {
      resume.basicInfo.address = optimization.address.optimized;
    }

    if (optimization.professionalSummary?.optimized !== undefined) {
      resume.professionalSummary = optimization.professionalSummary.optimized;
    }

    if (Array.isArray(optimization.workExperiences)) {
      optimization.workExperiences.forEach((optimizedExperience) => {
        const experience = resume.workExperiences.id(optimizedExperience.id);

        if (!experience) {
          return;
        }

        if (optimizedExperience.jobTitle !== undefined) {
          experience.jobTitle = optimizedExperience.jobTitle;
        }

        if (optimizedExperience.company !== undefined) {
          experience.company = optimizedExperience.company;
        }

        if (optimizedExperience.location !== undefined) {
          experience.location = optimizedExperience.location;
        }

        if (optimizedExperience.optimized !== undefined) {
          experience.description = optimizedExperience.optimized;
        }
      });
    }

    /*
    if (Array.isArray(optimization.educations)) {
      optimization.educations.forEach((optimizedEducation) => {
        const education = resume.educations.id(optimizedEducation.id);

        if (!education) {
          return;
        }

        // AI optimized school
        if (optimizedEducation.school?.optimized !== undefined) {
          education.school = optimizedEducation.school.optimized;
        }

        // AI optimized degree/field
        if (optimizedEducation.degreeField?.optimized !== undefined) {
          education.degreeField = optimizedEducation.degreeField.optimized;
        }

        const originalDescription = education.description?.trim() || "";

        if (originalDescription) {
          if (optimizedEducation.optimized !== undefined) {
            education.description = optimizedEducation.optimized;
          }
        } else {
          // User did not provide an education description.
          // Never allow AI to add one.
          education.description = "";
        }
      });
    }
    */

    if (Array.isArray(optimization.educations)) {
      optimization.educations.forEach((optimizedEducation) => {
        const education = resume.educations.id(optimizedEducation.id);

        if (!education) {
          return;
        }

        // AI optimized school
        if (optimizedEducation.school !== undefined) {
          education.school = optimizedEducation.school;
        }

        // AI optimized degree/field
        if (optimizedEducation.degreeField !== undefined) {
          education.degreeField = optimizedEducation.degreeField;
        }

        // AI optimized location
        if (optimizedEducation.location !== undefined) {
          education.location = optimizedEducation.location;
        }

        // DO NOT CHANGE schoolYear.
        // It always stays as entered by the user.

        // Only optimize description if original description exists.
        const originalDescription = education.description?.trim() || "";

        if (originalDescription && optimizedEducation.optimized !== undefined) {
          education.description = optimizedEducation.optimized;
        } else if (!originalDescription) {
          education.description = "";
        }
      });
    }



    if (optimization.skills?.optimized !== undefined) {
      resume.skills = optimization.skills.optimized;
    }

    if (Array.isArray(optimization.projects)) {
      optimization.projects.forEach((optimizedProject) => {
        const project = resume.projects.id(optimizedProject.id);

        if (project && optimizedProject.optimized !== undefined) {
          project.projectDescription = optimizedProject.optimized;
        }
      });
    }

    if (optimization.certificates?.optimized !== undefined) {
      resume.certificates = optimization.certificates.optimized;
    }

    await resume.save();

    const optimizedAnalysis = await generateResumeAnalysis(resume);

    if (!optimizedAnalysis || typeof optimizedAnalysis.atsScore !== "number") {
      return res.status(500).json({
        success: false,
        message: "AI did not return a valid optimized ATS score",
        errors: {},
      });
    }

    resume.aiOptimization.optimizedAnalysis = {
      ...optimizedAnalysis,
      generatedAt: new Date(),
    };

    const originalScore = originalAnalysis.atsScore;
    const optimizedScore = optimizedAnalysis.atsScore;
    const scoreImprovement = optimizedScore - originalScore;

    resume.currentStep = 7;

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume optimized successfully",

      originalScore,
      optimizedScore,
      scoreImprovement,

      originalAnalysis,
      optimizedAnalysis,

      optimization: resume.aiOptimization,

      resume,

      errors: {},
    });
  } catch (error) {
    console.error("Optimize resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to optimize resume",
      errors: {},
    });
  }
};

// GET COMPLETED RESUME
const getCompletedResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user.id,
      status: "completed",
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Completed resumes retrieved successfully",
      resumes,
      errors: {},
    });
  } catch (error) {
    console.error("Get completed resumes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve completed resumes",
      resumes: [],
      errors: {},
    });
  }
};

// EXPORT RESUME AS PDF
const exportResumePDF = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("USER:", req.user);
    console.log("PARAMS:", req.params);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const resume = await Resume.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const pdf = await generateResumePDF(resume);

    const fileName = `${(resume.basicInfo?.fullName || "resume")
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "_")}_Resume.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdf.length,
    });

    return res.send(pdf);
  } catch (error) {
    console.error("Export resume PDF error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export resume as PDF",
    });
  }
};

module.exports = {
  createResume,
  getDraftResume,
  getResume,
  //Create Resume
  saveBasicInfo,
  saveTargetJob,
  saveWorkExperience,
  saveEducation,
  generateSummary,
  saveSummaryExtras,
  analyzeResume,
  optimizeResume,
  saveTemplate,
  completeResume,
  //Export Resume
  exportResumePDF,
  //Get Resume
  getCompletedResumes,
};
