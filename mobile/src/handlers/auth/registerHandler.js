import validateRegisterForm from "../../utils/validation";

const registerHandler = ({
  register,
  navigation,
  setMessage,
  setModalVisible,

  fullName,
  email,
  password,
  confirmPassword,
  checked,

  setFullNameError,
  setEmailError,
  setPasswordError,
  setConfirmPasswordError,
  setTermsConditionError,
}) => {
  const handleRegister = async () => {
    // Clear previous errors
    setMessage("");
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsConditionError("");

    const validation = validateRegisterForm({
      fullName,
      email,
      password,
      confirmPassword,
      checked,
    });

    if (!validation.isValid) {
      const errors = validation.errors;

      setFullNameError(errors.fullName || "");
      setEmailError(errors.email || "");
      setPasswordError(errors.password || "");
      setConfirmPasswordError(errors.confirmPassword || "");
      setTermsConditionError(errors.termsCondition || "");

      return;
    }
    // -------------------------
    // BACKEND VALIDATION
    // -------------------------

    const result = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    });

    // -------------------------
    // HANDLE BACKEND ERRORS
    // -------------------------

    if (!result.success) {
      const errors = result.errors || {};

      setFullNameError(errors.fullName || "");
      setEmailError(errors.email || "");
      setPasswordError(errors.password || "");
      setConfirmPasswordError(errors.confirmPassword || "");

      if (Object.keys(errors).length === 0) {
        setMessage(result.message);
        setModalVisible(true);
      }

      return;
    }

    // -------------------------
    // SUCCESS
    // -------------------------
    setMessage("Registration successful");
    setModalVisible(true);
  };

  return {
    handleRegister,
  };
};

export default registerHandler;
