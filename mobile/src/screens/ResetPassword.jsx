import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconTextInput from "../components/IconTextInput";
import AppModal from "../components/AppModal";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

import useAuth from "../hooks/useAuth";
import resetPasswordHandler from "../handlers/auth/resetPasswordHandler";

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { resetToken } = route.params || {};

  const { resetPassword, loading } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { handleResetPassword } = resetPasswordHandler({
    resetPassword,
    navigation,
    resetToken,
    password,
    confirmPassword,
    setPasswordError,
    setConfirmPasswordError,
    setMessage,
    setModalVisible,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Ionicons name="arrow-back-outline" size={35} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subTitle}>Set your new password securely.</Text>

        <IconTextInput
          label="NEW PASSWORD"
          style={{ height: 55 }}
          icon="lock-closed-outline"
          placeholder="Enter your new password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          secureTextEntry={true}
          error={passwordError}
        />

        {passwordError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {passwordError}
          </Text>
        ) : null}

        <IconTextInput
          label="CONFIRM PASSWORD"
          style={{ height: 55 }}
          icon="lock-closed-outline"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError("");
          }}
          secureTextEntry={true}
          error={confirmPasswordError}
        />

        {confirmPasswordError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {confirmPasswordError}
          </Text>
        ) : null}

        <Button
          title="Submit"
          onPress={handleResetPassword}
          loading={loading}
          style={{ width: "100%" }}
        />
      </View>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);

          if (message === "Password reset successfully.") {
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Login",
                  },
                ],
              });
            }, 100);
          }
        }}
      />
    </ScrollView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15151B",
    marginTop: 37,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 120,
  },

  backButtonContainer: {
    paddingBottom: 30,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  iconContainer: {
    width: 150,
    height: 150,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 25,

    backgroundColor: "#25252F",

    borderRadius: 25,
  },

  title: {
    color: "#F8FAFC",

    fontSize: 28,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  subTitle: {
    fontSize: 15,
    color: "#71717A",
    marginBottom: 20,
  },

  createAccountText: {
    textAlign: "center",
    color: "#60A5FA",
    textDecorationLine: "underline",
    fontWeight: 600,
  },
});
