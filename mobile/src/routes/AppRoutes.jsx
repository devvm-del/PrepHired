import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import VerifyOtpScreen from "../screens/VerifyOtp";
import ResetPasswordScreen from "../screens/ResetPassword";

import HomeScreen from "../screens/Home";
import ResumeScreen from "../screens/Resume";
import InterviewScreen from "../screens/Interview";
import ProgressScreen from "../screens/Progress";
import ProfileScreen from "../screens/Profile";

import BasicInfo from "../screens/Resume/BasicInfo";
import TargetJobPosition from "../screens/Resume/TargetJobPosition";
import WorkExperience from "../screens/Resume/WorkExperience";
import Education from "../screens/Resume/Education";
import SummaryExtras from "../screens/Resume/SummaryExtras";
import AiGeneratedResume from "../screens/Resume/AiGeneratedResume";
import ChooseTemplate from "../screens/Resume/ChooseTemplate";
import ResumePreview from "../screens/Resume/ResumePreview";

import QuestionAndAnswer from "../screens/Interview/QuestionAndAnswer";
import AnswerFeedback from "../screens/Interview/AnswerFeedback";
import SessionCompleted from "../screens/Interview/SessionCompleted";
import ReviewAnswer from "../screens/Interview/ReviewAnswer";

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: "none",
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Resume" component={ResumeScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Interview" component={InterviewScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        <Stack.Screen name="BasicInfo" component={BasicInfo} />
        <Stack.Screen name="TargetJobPosition" component={TargetJobPosition} />
        <Stack.Screen name="WorkExperience" component={WorkExperience} />
        <Stack.Screen name="Education" component={Education} />
        <Stack.Screen name="SummaryExtras" component={SummaryExtras} />
        <Stack.Screen name="AiGeneratedResume" component={AiGeneratedResume} />
        <Stack.Screen name="ChooseTemplate" component={ChooseTemplate} />
        <Stack.Screen name="ResumePreview" component={ResumePreview} />

        <Stack.Screen name="QuestionAndAnswer" component={QuestionAndAnswer} />
        <Stack.Screen name="AnswerFeedback" component={AnswerFeedback} />
        <Stack.Screen name="SessionCompleted" component={SessionCompleted} />
        <Stack.Screen name="ReviewAnswer" component={ReviewAnswer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
