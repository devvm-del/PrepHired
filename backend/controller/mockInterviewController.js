const MockInterview = require("../models/mockInterview");
const {
  generateInterviewQuestions,
  analyzeInterviewAnswer,
  analyzeInterviewSession,
} = require("../services/ai/aiService");

const createMockInterview = async (req, res) => {
  try {
    const userId = req.user.id;

    const { targetJob, interviewCategory, responseMode, numberOfQuestions } =
      req.body;

    const errors = {};

    if (!userId) {
      errors.userId = "User authentication is required";
    }

    if (!targetJob?.trim()) {
      errors.targetJob = "Please enter the role you are targeting.";
    }

    const allowedCategories = [
      "Behavioral",
      "Technical",
      "HR Screening",
      "All",
    ];

    if (!interviewCategory) {
      errors.interviewCategory = "Interview category is required";
    } else if (!allowedCategories.includes(interviewCategory)) {
      errors.interviewCategory = "Invalid interview category";
    }

    const allowedResponseModes = ["Text", "Audio"];

    if (!responseMode) {
      errors.responseMode = "Response mode is required";
    } else if (!allowedResponseModes.includes(responseMode)) {
      errors.responseMode = "Invalid response mode";
    }

    const allowedNumberOfQuestions = [5, 8, 12, "5", "8", "12"];

    if (!numberOfQuestions) {
      errors.numberOfQuestions = "Number of questions is required";
    } else if (!allowedNumberOfQuestions.includes(numberOfQuestions)) {
      errors.numberOfQuestions = "Invalid number of questions";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const questionCount = Number(numberOfQuestions);

    // Generate questions using AI
    const questions = await generateInterviewQuestions({
      targetJob: targetJob.trim(),
      interviewCategory,
      numberOfQuestions: questionCount,
    });

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "AI did not return valid interview questions",
        errors: {},
      });
    }

    const formattedQuestions = questions.map((question, index) => ({
      questionNumber: index + 1,
      question:
        typeof question === "string" ? question : question.question || "",
      responseMode,
      answer: "",
      audioUrl: "",
      timeLimit: 60,
      timeUsed: 0,
      status: "pending",
    }));

    const mockInterview = await MockInterview.create({
      userId,
      targetJob: targetJob.trim(),
      interviewCategory,
      responseMode,
      numberOfQuestions: questionCount,
      currentQuestion: 1,
      status: "in-progress",
      questions: formattedQuestions,
      startedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Mock interview created successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Create mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create mock interview",
      errors: {},
    });
  }
};

// GET MOCK INTERVIEW
const getMockInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
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

    const mockInterview = await MockInterview.findOne({
      _id: id,
      userId,
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mock interview retrieved successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Get mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get mock interview",
      errors: {},
    });
  }
};

// SAVE INTERVIEW ANSWER
const saveInterviewAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const { questionNumber, answer, audioUrl, timeUsed } = req.body;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (!questionNumber) {
      errors.questionNumber = "Question number is required";
    }

    if (answer === undefined || answer === null) {
      errors.answer = "Answer is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mockInterview = await MockInterview.findOne({
      _id: id,
      userId: req.user.id,
      status: "in-progress",
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Active mock interview not found",
        errors: {},
      });
    }

    const question = mockInterview.questions.find(
      (item) => item.questionNumber === Number(questionNumber),
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Interview question not found",
        errors: {},
      });
    }

    question.answer = answer.trim();

    if (audioUrl !== undefined) {
      question.audioUrl = audioUrl;
    }

    if (timeUsed !== undefined) {
      question.timeUsed = Number(timeUsed);
    }

    question.status = "answered";
    question.answeredAt = new Date();

    mockInterview.currentQuestion = Number(questionNumber) + 1;

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Interview answer saved successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Save interview answer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save interview answer",
      errors: {},
    });
  }
};

// ANALYZE INTERVIEW ANSWER
const analyzeAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionNumber } = req.body;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (!questionNumber) {
      errors.questionNumber = "Question number is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mockInterview = await MockInterview.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    const question = mockInterview.questions.find(
      (item) => item.questionNumber === Number(questionNumber),
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Interview question not found",
        errors: {},
      });
    }

    if (!question.answer?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Interview answer is required",
        errors: {},
      });
    }

    const analysis = await analyzeInterviewAnswer({
      targetJob: mockInterview.targetJob,

      interviewCategory: mockInterview.interviewCategory,

      question: question.question,

      answer: question.answer,
    });

    if (!analysis || typeof analysis !== "object") {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid answer analysis",
        errors: {},
      });
    }

    question.score = analysis.score || 0;

    question.contentScore = analysis.contentScore || 0;

    question.confidenceScore = analysis.confidenceScore || 0;

    question.naturalScore = analysis.naturalScore || 0;

    question.feedback = analysis.feedback || "";

    question.toneAndModulation = analysis.toneAndModulation || "";

    question.wordChoiceSuggestions = analysis.wordChoiceSuggestions || [];

    question.strengths = analysis.strengths || [];

    question.improvements = analysis.improvements || [];

    question.status = "analyzed";
    question.analyzedAt = new Date();

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Interview answer analyzed successfully",
      analysis,
      question,
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Analyze interview answer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze interview answer",
      errors: {},
    });
  }
};

// ANALYZE INTERVIEW SESSION
const analyzeSession = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mockInterview = await MockInterview.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
        errors: {},
      });
    }

    const analysis = await analyzeInterviewSession({
      targetJob: mockInterview.targetJob,

      interviewCategory: mockInterview.interviewCategory,

      questions: mockInterview.questions,
    });

    if (!analysis || typeof analysis !== "object") {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid session analysis",
        errors: {},
      });
    }

    mockInterview.overallScore = analysis.overallScore || 0;

    mockInterview.skillBreakdown = analysis.skillBreakdown || {};

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Interview session analyzed successfully",
      analysis,
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Analyze interview session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze interview session",
      errors: {},
    });
  }
};

// COMPLETE MOCK INTERVIEW
const completeMockInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.id = "Mock interview ID is required";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const mockInterview = await MockInterview.findOne({
      _id: id,
      userId: req.user.id,
      status: "in-progress",
    });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Active mock interview not found",
        errors: {},
      });
    }

    mockInterview.status = "completed";
    mockInterview.completedAt = new Date();

    await mockInterview.save();

    return res.status(200).json({
      success: true,
      message: "Mock interview completed successfully",
      mockInterview,
      errors: {},
    });
  } catch (error) {
    console.error("Complete mock interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete mock interview",
      errors: {},
    });
  }
};

// GET COMPLETED MOCK INTERVIEWS
const getCompletedMockInterviews = async (req, res) => {
  try {
    const mockInterviews = await MockInterview.find({
      userId: req.user.id,
      status: "completed",
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Completed mock interviews retrieved successfully",
      mockInterviews,
      errors: {},
    });
  } catch (error) {
    console.error("Get completed mock interviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve completed mock interviews",
      mockInterviews: [],
      errors: {},
    });
  }
};

module.exports = {
  createMockInterview,
  getMockInterview,
  saveInterviewAnswer,
  analyzeAnswer,
  analyzeSession,
  completeMockInterview,
  getCompletedMockInterviews,
};
